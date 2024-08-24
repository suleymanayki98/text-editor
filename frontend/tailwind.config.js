module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-gray': '#919EAB52',
        'custom-blue': '#015FFB',
        'custom-dark': '#002E47',
        'custom-light-blue': '#E3F3FF',
        'custom-gray': '#F4F6F8',
        'custom-black': 'black',
        'dark-blue': '#002E47',
        'light-gray': '#F4F6F8',
        'custom-white': '#FFFFFF',
        'custom-light-gray': '#637381'
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
      },
      spacing: {
        '30': '30px',
        '56': '56px',
        '28': '28px',
        '110': '110px',
        '272': '272px',
        '426': '426px',
      },
      lineHeight: {
        'tight': '21.6px',
        'normal': '22px',
      },
      width: {
        '30': '30px',
        '86': '86px',
        '110': '110px',
        '117': '117px',
        '156': '156px',
        '228': '228px',
      },
      height: {
        '22': '22px',
        '30': '30px',
        '90': '90px',
      },
      borderRadius: {
        'lg': '8px',
      },
      gap: {
        '1': '4px',
        '2': '8px',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
}