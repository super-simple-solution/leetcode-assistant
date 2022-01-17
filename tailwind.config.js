module.exports = {
  purge: [ 
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      spacing: {
         8: '8px',
        10: '10px',
        16: '16px',
        24: '24px',
        20: '20px',
        32: '32px',
        40: '40px',
        48: '48px',
      },
      fontSize: {
        12: '12px',
        14: '14px',
      },
      colors: {
      },
      
    },
  },
  plugins: [],
}