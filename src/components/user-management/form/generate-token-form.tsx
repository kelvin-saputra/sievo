"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { GenerateTokenDTO } from "@/models/dto/user.dto"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RoleEnum } from "@/models/enums"
import { useState } from "react"
import { Check, Copy, AlertTriangle } from "lucide-react"

const formSchema = z.object({
  role: z.string({
    required_error: "Please select a role",
  }),
  duration: z.coerce.number().min(1, "Duration must be at least 1"),
  timeUnit: z.enum(["seconds", "minutes", "hours", "days", "weeks", "months"], {
    required_error: "Please select a time unit",
  }),
})

type FormValues = z.infer<typeof formSchema>

interface GenerateTokenModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerateToken: (data: GenerateTokenDTO) => Promise<string>
}

export function GenerateTokenModal({ open, onOpenChange, onGenerateToken }: GenerateTokenModalProps) {
  const timeUnitToSecond: Record<string, number> = {
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 86400,
    weeks: 604800,
    months: 2592000,
  }

  const [generatedToken, setGeneratedToken] = useState<string>("")
  const [showTokenResult, setShowTokenResult] = useState(false)
  const [copied, setCopied] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      duration: 1,
      timeUnit: "days",
    },
  })

  const onSubmit = async (values: FormValues) => {
    const durationInSeconds = values.duration * (timeUnitToSecond[values.timeUnit] || 1)

    const data: GenerateTokenDTO = {
      role: RoleEnum.parse(values.role),
      duration: durationInSeconds,
    }

    try {
      const token = await onGenerateToken(data)
      if (token) {
        setGeneratedToken(token)
        setShowTokenResult(true)
      }
    } catch (error) {
      console.error("Error in form submission:", error)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(generatedToken)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          form.reset()
          setShowTokenResult(false)
        }
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{showTokenResult ? "Token Generated Successfully" : "Generate Token"}</DialogTitle>
        </DialogHeader>

        {!showTokenResult ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EXECUTIVE">EXECUTIVE</SelectItem>
                        <SelectItem value="INTERNAL">INTERNAL</SelectItem>
                        <SelectItem value="FREELANCE">FREELANCER</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Unit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="seconds">Seconds</SelectItem>
                          <SelectItem value="minutes">Minutes</SelectItem>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="weeks">Weeks</SelectItem>
                          <SelectItem value="months">Months</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">Generate</Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium">Important!</p>
                <p>This token will only be shown once. Please save it in a secure location.</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Register Token:</div>
              <div className="relative">
                <div className="rounded-md border bg-muted p-3 text-xs font-mono break-all whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {generatedToken}
                </div>
                <Button size="sm" variant="ghost" className="absolute right-1 top-1" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                onClick={() => {
                  setShowTokenResult(false)
                  form.reset()
                  onOpenChange(false)
                }}
              >
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}