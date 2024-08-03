// src/components/ui/ToastProvider.tsx

// import React from 'react';
// import { Toast, ToastTitle, ToastDescription } from './toast';
// import { useToast } from './use-toast';

// export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { toasts, removeToast } = useToast();

//   return (
//     <>
//       {children}
//       {toasts.map((toast) => (
//         <Toast key={toast.id} onOpenChange={() => removeToast(toast.id)}>
//           <ToastTitle>{toast.title}</ToastTitle>
//           {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
//         </Toast>
//       ))}
//     </>
//   );
// };