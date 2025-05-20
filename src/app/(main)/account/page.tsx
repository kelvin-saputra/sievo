"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pencil } from "lucide-react"
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
import { useSafeContext } from "@/hooks/use-safe-context"
import ProfileContext from "@/models/context/profile-context"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { UpdateUserProfileDTO } from "@/models/dto/user.dto"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)

  const { user, handleUpdateProfile } = useSafeContext(ProfileContext, "Profile Context")

  const form = useForm<UpdateUserProfileDTO>({
    defaultValues: {
      id: user?.id,
      name: user?.name,
      phone_number: user?.phone_number,
      email: user?.email,
      role: user?.role,
      started_at: user?.started_at,
      ended_at: user?.ended_at,
      is_active: user?.is_active || false,
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        id: user.id,
        name: user.name,
        phone_number: user.phone_number,
        email: user.email,
        role: user.role,
        started_at: user.started_at,
        ended_at: user.ended_at,
        is_active: user.is_active || false,
      })
    }
  }, [user, form])

  // Get form methods
  const { register, handleSubmit, watch, setValue } = form
  const currentValues = watch()

  // Focus the name input when editing name
  useEffect(() => {
    if (isEditingName) {
      const nameInput = document.getElementById("name")
      if (nameInput) {
        nameInput.focus()
      }
    }
  }, [isEditingName])

  const onSubmit = (data: UpdateUserProfileDTO) => {
    const emailRegex = /^\S+@\S+\.\S+$/

    if (!data.email) {
      form.setError("email", { message: "Email is required!" })
      return
    } else if (!emailRegex.test(data.email)) {
      form.setError("email", {
        message: "Invalid email format!",
      })
      return
    }

    if (!data.phone_number) {
      form.setError("phone_number", {
        message: "Phone number is required!",
      })
      return
    }
    handleUpdateProfile(data)

    setIsEditing(false)
    setIsEditingName(false)
  }

  const handleCancel = () => {
    form.reset({
      id: user?.id,
      name: user?.name,
      phone_number: user?.phone_number,
      email: user?.email,
      role: user?.role,
      started_at: user?.started_at,
      ended_at: user?.ended_at,
      is_active: user?.is_active || false,
    })
    setIsEditing(false)
    setIsEditingName(false)
  }

  const toggleNameEdit = () => {
    setIsEditingName(!isEditingName)
    if (!isEditing) {
      setIsEditing(true)
    }
  }

  const getUserInitials = (name: string) => {
    if (!name) return ""

    const nameParts = name.split(" ")
    return nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : `${nameParts[0][0]}`.toUpperCase()
  }

  const formatDateToEnglish = (date: Date | string | undefined) => {
    if (!date) return ""

    // Convert to Date object if it's a string
    const dateObj = typeof date === "string" ? new Date(date) : date

    // Array of day names in English
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    // Array of month names in English
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    const day = days[dateObj.getDay()]
    const dateNum = dateObj.getDate()
    const month = months[dateObj.getMonth()]
    const year = dateObj.getFullYear()

    return `${day}, ${dateNum} ${month} ${year}` === "Thursday, 1 January 1970"
      ? "You Are Still Active"
      : `${day}, ${dateNum} ${month} ${year}`
  }
  return (
    <div className="container mx-auto py-10 w-full">
      {user && (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full border-4 border-gray-200 flex items-center justify-center">
                    <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                      <Avatar className="h-full w-full rounded-full border border-border/50 transition-all duration-200 group-hover:border-border bg-gray-300">
                        <AvatarFallback className="rounded-full text-primary bg-gray-300 flex items-center justify-center w-full h-full">
                          <div className="font-bold text-5xl flex items-center justify-center w-full h-full">
                            {getUserInitials(currentValues.name || "")}
                          </div>
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
                <Badge
                  className={`mt-5 ${currentValues.is_active === true ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"} px-4 py-1 rounded-full`}
                >
                  {currentValues.is_active === true ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    {isEditingName ? (
                      <Input
                        id="name"
                        {...register("name", {
                          required: true,
                          onBlur: (e) => {
                            if (!e.target.value.trim()) {
                              setValue("name", user?.name)
                            }
                            setIsEditingName(false)
                          },
                        })}
                        className="text-2xl font-bold h-auto py-1 px-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setIsEditingName(false)
                          }
                        }}
                      />
                    ) : (
                      <h1 className="text-4xl font-bold">{currentValues.name}</h1>
                    )}
                    {isEditing && (
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                        onClick={toggleNameEdit}
                      >
                        <Pencil size={20} />
                      </button>
                    )}
                  </div>
                  <Badge variant={"default"} className="mt-2 px-4 py-1 rounded-full">
                    {currentValues.role}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} className={!isEditing ? "bg-gray-50" : ""} />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormItem className="space-y-2">
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input value={formatDateToEnglish(user.started_at)} disabled={true} className="bg-gray-50" />
                    </FormControl>
                  </FormItem>

                  <FormItem className="space-y-2">
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input value={formatDateToEnglish(user.ended_at)} disabled={true} className="bg-gray-50" />
                    </FormControl>
                  </FormItem>

                  <div className="flex justify-end gap-2 pt-4">
                    {isEditing ? (
                      <>
                        <Button type="button" variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                        <Button type="submit" variant="default">
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button type="button" variant="default" onClick={() => setIsEditing(true)}>
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
