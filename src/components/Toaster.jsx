import { Toaster } from 'react-hot-toast';

const HotToaster = () => (
  <Toaster
    position="top-right"
    reverseOrder={false}
    gutter={8}
    containerClassName=""
    containerStyle={{}}
    toastOptions={{
      className: '',
      duration: 4000,
      style: {
        background: 'white',
        color: '#333',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
      },
      success: {
        style: {
          border: '1px solid #28a745',
          background: '#d4edda',
          color: '#155724',
        },
        iconTheme: {
          primary: '#28a745',
          secondary: 'white',
        },
      },
      error: {
        style: {
          border: '1px solid #dc3545',
          background: '#f8d7da',
          color: '#721c24',
        },
        iconTheme: {
          primary: '#dc3545',
          secondary: 'white',
        },
      },
    }}
  />
);

export default HotToaster;

