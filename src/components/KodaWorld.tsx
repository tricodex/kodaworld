import React from 'react'
   import Link from 'next/link'

   const KodaWorld: React.FC = () => {
     return (
       <div>
         <p className="text-lg mb-4">Explore our educational sections:</p>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           <Link href="/element-lab" className="p-4 border rounded-lg hover:bg-gray-100">
             Element Lab
           </Link>
           <Link href="/science" className="p-4 border rounded-lg hover:bg-gray-100">
             Science
           </Link>
           <Link href="/geography" className="p-4 border rounded-lg hover:bg-gray-100">
             Geography
           </Link>
           <Link href="/history" className="p-4 border rounded-lg hover:bg-gray-100">
             History
           </Link>
           <Link href="/music" className="p-4 border rounded-lg hover:bg-gray-100">
             Music
           </Link>
           <Link href="/chat" className="p-4 border rounded-lg hover:bg-gray-100">
             Chat
           </Link>
         </div>
       </div>
     )
   }

   export default KodaWorld