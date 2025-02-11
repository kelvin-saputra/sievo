export default function Home() {
  return (
    <>
		<div className="bg-black w-screen h-screen flex items-center justify-center">
			<div className="text-center">
				<p className="text-6xl mb-16 font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
					PROYEK PENGEMBANGAN SISTEM INFORMASI <br />
					<span className="text-5xl font-bold">SI-EVO: Sistem Informasi Event Organizer</span>
				</p>
				<div className="flex justify-center space-x-10">
					<div className="bg- p-8 rounded-lg shadow-lg w-1/3 transform transition duration-500 hover:scale-105 bg-clip-border border-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
						<div className="p-8 -m-7 rounded-lg shadow-lg transform transition duration-500 bg-black text-red-50">
							<h2 className="text-3xl font-bold">Propensi Cracked</h2>
							<table className="table-auto w-full text-justify mt-4">
								<tbody>
									<tr>
										<td className="text-lg font-semibold pt-0.5">Calista Sekar Pamaja</td>
										<td className="text-lg font-semibold pt-0.5">Product Manager</td>
									</tr>
									<tr>
										<td className="text-lg font-semibold pt-0.5">Aiza Derisyana</td>
										<td className="text-lg font-semibold pt-0.5">System Designer</td>
									</tr>
									<tr>
										<td className="text-lg font-semibold pt-0.5">Edward Salim</td>
										<td className="text-lg font-semibold pt-0.5">Scrum Master</td>
									</tr>
									<tr>
										<td className="text-lg font-semibold pt-0.5">Kelvin Saputra</td>
										<td className="text-lg font-semibold pt-0.5">Lead Programmer</td>
									</tr>
									<tr>
										<td className="text-lg font-semibold pt-0.5">Roger Moreno</td>
										<td className="text-lg font-semibold pt-0.5">System Analyst</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<div className="p-8 rounded-lg shadow-lg w-1/3 transform transition duration-500 hover:scale-105 bg-clip-border border-transparent bg-gradient-to-r from-red-500 via-pink-500 to-purple-400">
						<div className="p-18 -m-7 rounded-lg shadow-lg transform transition duration-500 bg-black text-red-50">
							<h2 className="text-3xl font-bold">PT Matahati Inspira</h2>
							<p className="text-LG font-semibold mt-4">Hadir dari tahun 2011 selalu berkomitmen memberikan <span className="font-bold">Best Quality Services-Product</span> untuk advertising dan MICE</p>
						</div>
					</div>
				</div>
			</div>
		</div>
    </>
  );
}
