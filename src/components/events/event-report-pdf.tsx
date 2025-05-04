import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { registerPlusJakartaSans } from "@/utils/pdfFontRegister";
import { PDF_THEME_COLORS as COLORS } from "@/utils/pdfThemeColors";

registerPlusJakartaSans();

type TaskStatus = "PENDING" | "ON_PROGRESS" | "DONE" | "CANCELLED";

const statusMap: Record<TaskStatus, { label: string; color: string }> = {
  PENDING: { label: "Belum Dikerjakan", color: COLORS.warning },
  ON_PROGRESS: { label: "Sedang Berjalan", color: COLORS.primary },
  DONE: { label: "Selesai", color: COLORS.success },
  CANCELLED: { label: "Dibatalkan", color: COLORS.gray },
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 11,
    padding: 24,
    lineHeight: 1.5,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.header,
    padding: 16,
    borderRadius: 6,
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: 700, color: COLORS.headerText },
  sub: { fontSize: 10, color: COLORS.subHeaderText, marginTop: 4 },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 10,
    marginBottom: 12,
  },
  infoBlock: { minWidth: 120, marginRight: 24, marginBottom: 2 },
  infoLabel: { fontSize: 9, color: COLORS.textSecondary },
  infoValue: { fontSize: 11, fontWeight: 500 },

  section: { marginBottom: 18 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: COLORS.primary,
    marginBottom: 6,
  },
  description: {
    fontSize: 10,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    padding: 6,
    marginTop: 2,
    marginBottom: 8,
    minHeight: 30,
  },

  progressRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 10,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 9,
    fontWeight: 700,
    color: "#fff",
    minWidth: 24,
    textAlign: "center" as const,
  },

  table: { marginTop: 8 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.lightGray,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 4,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  oddRow: { backgroundColor: COLORS.rowGray },

  cell1: { flex: 1.5, paddingHorizontal: 4, fontSize: 10 },
  cell2: { flex: 1.5, paddingHorizontal: 4, fontSize: 10 },
  cell3: { flex: 1.5, paddingHorizontal: 4, fontSize: 10 },
  cell4: { flex: 1.5, paddingHorizontal: 4, fontSize: 10 },
  cell5: { flex: 1.5, paddingHorizontal: 4, fontSize: 10 },

  vendorRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    backgroundColor: COLORS.lightGray,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 6,
    marginHorizontal: 0,
    fontSize: 10,
  },
  vendorCell: { marginRight: 12, minWidth: 40, fontSize: 10 },
  vendorName: { fontWeight: 700, color: COLORS.primary, minWidth: 64 },
  vendorRating: { color: COLORS.accent, marginLeft: 8, fontWeight: 700 },
  vendorDesc: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    marginTop: 2,
  },

  inventoryRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    backgroundColor: COLORS.rowGray,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 6,
    marginHorizontal: 0,
    fontSize: 10,
  },
  inventoryCell: { marginRight: 12, minWidth: 40, fontSize: 10 },
  inventoryName: { fontWeight: 700, color: COLORS.primary, minWidth: 64 },
  inventoryStatus: {
    fontWeight: 700,
    minWidth: 55,
    textAlign: "right" as const,
  },
  inventoryDesc: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    marginTop: 2,
  },

  emptyNotice: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginVertical: 12,
  },
});

export function EventReportPDF({
  event,
  users = [],
  tasks = [],
  budgetPlanItems = [],
  actualBudgetItems = [],
  categoriesPlan = [],
  client,
  manager,
}: any) {
  const progressCount: Record<TaskStatus, number> = {
    PENDING: 0,
    ON_PROGRESS: 0,
    DONE: 0,
    CANCELLED: 0,
  };
  tasks.forEach((t: any) => {
    const s = t.status as TaskStatus;
    if (progressCount[s] !== undefined) progressCount[s] += 1;
  });

  const totalPlanned = budgetPlanItems.reduce(
    (s: number, i: any) => s + i.item_subtotal,
    0
  );
  const totalActual = actualBudgetItems.reduce(
    (s: number, i: any) => s + i.item_subtotal,
    0
  );

  const categoryComparisons = categoriesPlan.map((cat: any) => {
    const planned = budgetPlanItems
      .filter((i: any) => i.category_id === cat.category_id)
      .reduce((s: number, i: any) => s + i.item_subtotal, 0);
    const actual = actualBudgetItems
      .filter((i: any) => i.category_id === cat.category_id)
      .reduce((s: number, i: any) => s + i.item_subtotal, 0);
    return { ...cat, planned, actual, diff: actual - planned };
  });

  const getBudgetItemName = (i: any) =>
    i.vendor_service?.service_name ??
    i.category?.category_name ??
    i.inventory?.item_name ??
    i.other_item?.item_name ??
    "Unknown";

  const getAssignee = (assigned_id: string) => {
    const user = users.find((u: any) => u.id === assigned_id);
    return user?.name || user?.email || "-";
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {event?.event_name || "Event Report"}
          </Text>
          <View style={{ height: 8 }} />
          <Text style={styles.sub}>
            {event?.start_date &&
              new Date(event.start_date).toLocaleDateString()}{" "}
            – {event?.end_date && new Date(event.end_date).toLocaleDateString()}{" "}
            • {event?.location}
            {event?.participant_plan && ` • Peserta: ${event.participant_plan}`}
          </Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Client</Text>
            <Text style={styles.infoValue}>
              {client?.name || client?.email || "-"}
            </Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>PIC</Text>
            <Text style={styles.infoValue}>
              {manager?.name || manager?.email || "-"}
            </Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Tentang Event</Text>
            <Text style={styles.infoValue}>
              {event?.event_description || "-"}
            </Text>
          </View>
        </View>

        {event?.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Catatan Event</Text>
            <Text style={styles.description}>{event.notes}</Text>
          </View>
        )}

        <View style={[styles.section, { marginBottom: 6 }]}>
          <Text style={styles.sectionTitle}>Progress Tugas</Text>
          <View style={styles.progressRow}>
            {(Object.keys(statusMap) as TaskStatus[]).map((s) => (
              <View
                key={s}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Text
                  style={{
                    ...styles.badge,
                    backgroundColor: statusMap[s].color,
                  }}
                >
                  {progressCount[s]}
                </Text>
                <Text style={{ fontSize: 10, marginLeft: 2 }}>
                  {statusMap[s].label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tabel Tugas ({tasks.length})</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.cell1}>Nama Tugas</Text>
              <Text style={styles.cell2}>Penanggung Jawab</Text>
              <Text style={styles.cell3}>Deadline</Text>
              <Text style={styles.cell4}>Status</Text>
            </View>
            {tasks.length ? (
              tasks.map((t: any) => (
                <View key={t.task_id} style={styles.tableRow}>
                  <Text style={styles.cell1}>{t.title}</Text>
                  <Text style={styles.cell2}>{getAssignee(t.assigned_id)}</Text>
                  <Text style={styles.cell3}>
                    {t.due_date
                      ? new Date(t.due_date).toLocaleDateString()
                      : "-"}
                  </Text>
                  <Text
                    style={{
                      ...styles.cell4,
                      color: statusMap[t.status as TaskStatus].color,
                      fontWeight: 700,
                    }}
                  >
                    {statusMap[t.status as TaskStatus].label}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <Text style={{ ...styles.cell1, flex: 5, textAlign: "center" }}>
                  Tidak ada tugas tercatat.
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Rencana Anggaran — Total Rp{totalPlanned.toLocaleString("id-ID")}
          </Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.cell1}>Kategori</Text>
              <Text style={styles.cell2}>Item</Text>
              <Text style={styles.cell3}>Qty</Text>
              <Text style={styles.cell4}>Subtotal</Text>
            </View>
            {budgetPlanItems.length ? (
              budgetPlanItems.map((it: any) => (
                <View key={it.budget_item_id} style={styles.tableRow}>
                  <Text style={styles.cell1}>
                    {it.category?.category_name || "-"}
                  </Text>
                  <Text style={styles.cell2}>{getBudgetItemName(it)}</Text>
                  <Text style={styles.cell3}>{it.item_qty}</Text>
                  <Text style={styles.cell4}>
                    Rp{it.item_subtotal.toLocaleString("id-ID")}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <Text style={{ ...styles.cell1, flex: 5, textAlign: "center" }}>
                  Tidak ada data anggaran rencana.
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Realisasi Anggaran — Total Rp{totalActual.toLocaleString("id-ID")}
          </Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.cell1}>Kategori</Text>
              <Text style={styles.cell2}>Item</Text>
              <Text style={styles.cell3}>Qty</Text>
              <Text style={styles.cell4}>Subtotal</Text>
              <Text style={styles.cell5}>Status</Text>
            </View>
            {actualBudgetItems.length ? (
              actualBudgetItems.map((it: any) => (
                <View key={it.actual_budget_item_id} style={styles.tableRow}>
                  <Text style={styles.cell1}>
                    {it.category?.category_name || "-"}
                  </Text>
                  <Text style={styles.cell2}>{getBudgetItemName(it)}</Text>
                  <Text style={styles.cell3}>{it.item_qty}</Text>
                  <Text style={styles.cell4}>
                    Rp{it.item_subtotal.toLocaleString("id-ID")}
                  </Text>
                  <Text style={styles.cell5}>{it.status}</Text>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <Text style={{ ...styles.cell1, flex: 5, textAlign: "center" }}>
                  Tidak ada data anggaran realisasi.
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Perbandingan Anggaran per Kategori
          </Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.cell1}>Kategori</Text>
              <Text style={styles.cell3}>Rencana</Text>
              <Text style={styles.cell4}>Realisasi</Text>
              <Text style={styles.cell5}>Selisih</Text>
            </View>
            {categoryComparisons.length ? (
              categoryComparisons.map((c: any) => (
                <View key={c.category_id} style={styles.tableRow}>
                  <Text style={styles.cell1}>{c.category_name}</Text>
                  <Text style={styles.cell3}>
                    Rp{c.planned.toLocaleString("id-ID")}
                  </Text>
                  <Text style={styles.cell4}>
                    Rp{c.actual.toLocaleString("id-ID")}
                  </Text>
                  <Text
                    style={[
                      styles.cell5,
                      {
                        color: c.diff > 0 ? COLORS.destructive : COLORS.success,
                        fontWeight: 700,
                      },
                    ]}
                  >
                    {c.diff >= 0 ? "+" : "-"}Rp
                    {Math.abs(c.diff).toLocaleString("id-ID")}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <Text style={{ ...styles.cell1, flex: 5, textAlign: "center" }}>
                  Tidak ada kategori anggaran.
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servis Vendor</Text>
          {(() => {
            const vendorItems = actualBudgetItems.filter(
              (item: any) => item.vendor_service
            );

            return vendorItems.length ? (
              vendorItems.map((item: any) => {
                const v = item.vendor_service;
                return (
                  <View key={item.actual_budget_item_id}>
                    <View style={styles.vendorRow}>
                      <Text style={[styles.vendorCell, styles.vendorName]}>
                        {v.service_name}
                      </Text>
                      <Text style={styles.vendorCell}>
                        {v.category?.replace(/_/g, " ") || "-"}
                      </Text>
                      <Text style={styles.vendorCell}>ID: {v.vendor_id}</Text>
                      <Text style={styles.vendorCell}>
                        Rp{item.item_subtotal.toLocaleString("id-ID")}
                      </Text>
                      {v.rating !== undefined && (
                        <Text style={styles.vendorRating}>{v.rating}</Text>
                      )}
                    </View>
                    {v.description && (
                      <Text style={styles.vendorDesc}>{v.description}</Text>
                    )}
                  </View>
                );
              })
            ) : (
              <Text style={styles.emptyNotice}>
                Tidak ada layanan vendor yang digunakan.
              </Text>
            );
          })()}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inventaris yang Terpakai</Text>
          {(() => {
            const inventoryItems = actualBudgetItems.filter(
              (item: any) => item.inventory
            );

            return inventoryItems.length ? (
              inventoryItems.map((item: any) => {
                const inv = item.inventory;
                return (
                  <View key={item.actual_budget_item_id}>
                    <View style={styles.inventoryRow}>
                      <Text
                        style={[styles.inventoryCell, styles.inventoryName]}
                      >
                        {inv.item_name}
                      </Text>
                      <Text style={styles.inventoryCell}>
                        {inv.category?.replace(/_/g, " ") || "-"}
                      </Text>
                      <Text style={styles.inventoryCell}>
                        Jumlah: {item.item_qty}
                      </Text>
                      <Text style={styles.inventoryCell}>
                        Rp{inv.item_price.toLocaleString("id-ID")}
                      </Text>
                      <Text
                        style={[
                          styles.inventoryCell,
                          styles.inventoryStatus,
                          {
                            color: inv.is_avail
                              ? COLORS.success
                              : COLORS.destructive,
                          },
                        ]}
                      >
                        {inv.is_avail ? "Tersedia" : "Tidak Tersedia"}
                      </Text>
                    </View>
                    {inv.description && (
                      <Text style={styles.inventoryDesc}>
                        {inv.description}
                      </Text>
                    )}
                  </View>
                );
              })
            ) : (
              <Text style={styles.emptyNotice}>
                Tidak ada inventaris yang digunakan.
              </Text>
            );
          })()}
        </View>
      </Page>
    </Document>
  );
}
