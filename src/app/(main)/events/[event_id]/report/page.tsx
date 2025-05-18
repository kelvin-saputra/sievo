"use client";

import { useSafeContext } from "@/hooks/use-safe-context";
import EventContext from "@/models/context/event.context";
import { PDFViewer } from "@react-pdf/renderer";
import { EventReportPDF } from "@/components/events/event-report-pdf";
import { ADMINEXECUTIVEINTERNAL, checkRoleClient } from "@/lib/rbac-client";

export default function EventReportPage() {
  const ctx = useSafeContext(EventContext, "EventContext");

  if (!ctx.event) {
    return (<p className="text-red-600">No event data available.</p>);
  }

  if (!checkRoleClient(ADMINEXECUTIVEINTERNAL)) {
    return (
      <div className="max-w-2xl mx-auto mt-16 p-8 bg-red-50 border border-red-300 rounded text-center">
        <h2 className="text-xl font-semibold mb-2 text-red-800">
          Akses ditolak
        </h2>
        <p className="text-red-700">
          Anda tidak memiliki akses untuk melihat laporan ini.
        </p>
      </div>
    );
  }

  if (ctx.event.status !== "DONE" && ctx.event.status !== "REPORTING") {
    return (
      <div className="max-w-2xl mx-auto mt-16 p-8 bg-yellow-50 border border-yellow-300 rounded text-center">
        <h2 className="text-xl font-semibold mb-2 text-yellow-800">
          Laporan belum tersedia
        </h2>
        <p className="text-yellow-700">
          Laporan hanya dapat diakses jika status event sudah{" "}
          <b>REPORTING atau DONE</b>.
          <br />
          Saat ini status event adalah:{" "}
          <span className="font-semibold">{ctx.event.status}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PDFViewer
        width="100%"
        height="800px"
        className="border"
        showToolbar={true}
      >
        <EventReportPDF {...ctx} />
      </PDFViewer>
    </div>
  );
}
