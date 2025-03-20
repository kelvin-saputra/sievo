import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SIEVO: Sistem Informasi Event Organizer",
  description: "SIEVO: Sistem Informasi Event Organizer PT Matahati Inspira",
  icons: [{ url: "/favicon.ico", rel: "icon" }],
  other: {
    uri: "/",
    pathName: "Home",
  },
}

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl lg:text-6xl mb-6 md:mb-10 lg:mb-16 font-extrabold">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-black to-slate-900">
            PROYEK PENGEMBANGAN SISTEM INFORMASI
          </span>
        </h1>
        <h2 className="tex`t-2xl md:text-3xl lg:text-5xl font-bold mb-10 md:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          SI-EVO: Sistem Informasi Event Organizer
        </h2>

        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-10 px-4">
          {/* Team Card */}
          <div className="w-full md:w-1/2 lg:w-2/5 rounded-xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
            <div className="p-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-xl">
              <div className="bg-black text-white p-6 md:p-8 rounded-lg">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                  Propensi Cracked
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <tbody>
                      <tr className="border-b border-gray-800">
                        <td className="py-3 text-sm md:text-base font-semibold">Calista Sekar Pamaja</td>
                        <td className="py-3 text-sm md:text-base font-semibold text-pink-400">Product Manager</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-3 text-sm md:text-base font-semibold">Aiza Derisyana</td>
                        <td className="py-3 text-sm md:text-base font-semibold text-pink-400">System Designer</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-3 text-sm md:text-base font-semibold">Edward Salim</td>
                        <td className="py-3 text-sm md:text-base font-semibold text-pink-400">Scrum Master</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-3 text-sm md:text-base font-semibold">Kelvin Saputra</td>
                        <td className="py-3 text-sm md:text-base font-semibold text-pink-400">Lead Programmer</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-sm md:text-base font-semibold">Roger Moreno</td>
                        <td className="py-3 text-sm md:text-base font-semibold text-pink-400">System Analyst</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Company Card */}
          <div className="w-full md:w-1/2 lg:w-2/5 rounded-xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl mt-8 md:mt-0">
            <div className="p-1 bg-gradient-to-r from-red-500 via-pink-500 to-purple-400 rounded-xl">
              <div className="bg-black text-white p-6 md:p-8 rounded-lg flex flex-col justify-between h-full">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-purple-400">
                  PT Matahati Inspira
                </h2>
                <div className="mt-4">
                  <p className="text-base md:text-lg font-medium leading-relaxed">
                    Hadir dari tahun 2011 selalu berkomitmen memberikan
                    <span className="font-bold text-pink-400 block mt-2">Best Quality Services-Product</span>
                    untuk advertising dan MICE
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-medium">
                      Advertising
                    </span>
                    <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-red-500 rounded-full text-xs font-medium">
                      Events
                    </span>
                    <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-xs font-medium">
                      MICE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
