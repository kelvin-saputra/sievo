"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, BarChart3, Users, Contact, FileText, Package } from "lucide-react"
import useHomepage from "@/hooks/use-homepage";
import { useEffect } from "react";
import { eventStatusColorMap } from "@/utils/eventStatusColorMap";
import { ADMINEXECUTIVE, ADMINEXECUTIVEINTERNAL } from "@/lib/rbac-client";
import Loading from "@/components/ui/loading";

export default function Home() {
  const {
      homepageData,
      loading,
      fetchHomepageData
    } = useHomepage();

  useEffect(() => {
      fetchHomepageData()
    }, [fetchHomepageData]);

  if (loading) {
    return <Loading message="Mengambil data pengguna" />
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="relative h-[400px] w-full">
        <div className="absolute inset-0">
          <Image
            src="/header.png?height=400&width=1200"
            alt="Event collage"
            fill
            className="object-cover brightness-75"
            priority
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">Welcome to SI-EVO!</h1>
        </div>
      </div>

      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 md:grid-cols-${homepageData?.role !== "FREELANCE"? 3:2} gap-4`}>
          <div className="bg-[#2c3e50] text-white p-6 rounded-lg">
            <h3 className="text-lg font-medium">All Active Events</h3>
            <p className="text-5xl font-bold mt-2">{homepageData?.event.length}</p>
          </div>
          {homepageData?.role !== "FREELANCE" && (<div className="bg-[#2c3e50] text-white p-6 rounded-lg">
            <h3 className="text-lg font-medium">Managed Active Events</h3>
            <p className="text-5xl font-bold mt-2">{homepageData?.total_manage}</p>
          </div>)}
          <div className="bg-[#2c3e50] text-white p-6 rounded-lg">
            <h3 className="text-lg font-medium">Open Tasks</h3>
            <p className="text-5xl font-bold mt-2">{homepageData?.total_task}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
          <Link
            href="/events"
            className="bg-gray-100 p-6 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
            >
            <Calendar className="h-6 w-6" />
            <span className="text-center">Event</span>
          </Link>
            {homepageData && ADMINEXECUTIVE.includes(homepageData.role) && (
              <>
                <Link
                  href="/dashboard"
                  className="bg-gray-100 p-6 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-center">Dashboard</span>
                </Link>
                <Link
                  href="/human-resources"
                  className="bg-gray-100 p-6 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <Users className="h-6 w-6" />
                  <span className="text-center">Human Resource</span>
                </Link>
              </>
            )}
          <Link
            href="/contact"
            className="bg-gray-100 p-6 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <Contact className="h-6 w-6" />
            <span>Contact</span>
          </Link>
          {homepageData && ADMINEXECUTIVEINTERNAL.includes(homepageData.role) && (
            <Link
              href="/proposal"
              className="bg-gray-100 p-6 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <FileText className="h-6 w-6" />
              <span className="text-center">Proposal</span>
            </Link>
          )}
          <Link
            href="/inventory"
            className="bg-gray-100 p-6 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <Package className="h-6 w-6" />
            <span className="text-center">Inventory</span>
          </Link>
        </div>

        {/* Upcoming Events */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Upcoming Event</h2>
          <div className="border-t border-gray-200">
            {homepageData?.event && homepageData.event.length > 0 ? (
              homepageData.event.map((event, index) => (
                <Link key={index} href={`events/${event.event_id}`} >
                  <div  className="py-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="text-sm">
                      {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                    </div>
                    <div className="font-medium">{event.event_name}</div>
                    <div className={`${eventStatusColorMap[event.status]} px-4 py-1 rounded-full text-sm`}>
                      {event.status}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">Tidak ada upcoming event saat ini</div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
