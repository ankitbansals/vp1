// 'client';

// import React from 'react';
// import { useBrand, useBrandClasses } from './use-theme';

// /**
//  * Example component demonstrating theme usage
//  */
// export const ThemedButton: React.FC<{ onClick?: () => void }> = ({ onClick, children }) => {
//   // Get the current brand
//   const brand = useBrand() as BrandName;
  
//   // Get brand-specific classes
//   const buttonClasses = useBrandClasses({
//     'vinod-patel': 'bg-orange-500 hover:bg-orange-600 text-white',
//     'home-living': 'bg-green-600 hover:bg-green-700 text-white',
//     'neutral': 'bg-gray-700 hover:bg-gray-800 text-white'
//   } as Record<BrandName, string>);
  
//   return (
//     <button
//       className={`px-4 py-2 rounded-md transition-colors ${buttonClasses}`}
//       onClick={onClick}
//     >
//       {children || `Click me! (${brand})`}
//     </button>
//   );
// };

// /**
//  * Example component showing brand-specific content
//  */
// export const BrandContent: React.FC = () => {
//   const brand = useBrand();
  
//   type BrandContent = Record<BrandName, string>;
  
//   const brandContent: BrandContent = {
//     'vinod-patel': 'Welcome to Vinod Patel',
//     'home-living': 'Welcome to Home & Living',
//     'neutral': 'Welcome to our Store'
//   };
  
//   const brandDescription: BrandContent = {
//     'vinod-patel': 'Your trusted partner for quality products',
//     'home-living': 'Transform your living space with our collection',
//     'neutral': 'Discover our products'
//   };
  
//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold mb-4">{brandContent[brand]}</h1>
//       <p className="text-lg mb-6">{brandDescription[brand]}</p>
      
//       <div className="space-y-4">
//         <ThemedButton />
//         <ThemedButton>Shop Now</ThemedButton>
//       </div>
      
//       <div className="mt-8 p-4 border rounded-lg">
//         <h2 className="text-xl font-semibold mb-2">Current Brand:</h2>
//         <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
//           {JSON.stringify({ brand }, null, 2)}
//         </pre>
//       </div>
//     </div>
//   );
// };

// /**
//  * Example page component that uses the theming system
//  */
// export const ExampleThemedPage: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="border-b bg-white">
//         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//           <h1 className="text-2xl font-bold">Brand Demo</h1>
//           <div className="flex space-x-4">
//             <a href="/vinod-patel" className="px-3 py-1 rounded hover:bg-gray-100">VP</a>
//             <a href="/home-living" className="px-3 py-1 rounded hover:bg-gray-100">Home</a>
//             <a href="/neutral" className="px-3 py-1 rounded hover:bg-gray-100">Neutral</a>
//           </div>
//         </div>
//       </header>
      
//       <main className="container mx-auto px-4 py-8">
//         <BrandContent />
//       </main>
      
//       <footer className="border-t bg-white mt-8 py-6">
//         <div className="container mx-auto px-4 text-center text-gray-600">
//           <p>© {new Date().getFullYear()} All rights reserved</p>
//         </div>
//       </footer>
//     </div>
//   );
// };
