export const getBadgeStyles = (variant: string = 'primary') => {
    const styles = {
      primary: 'border-[#ABEFC6] bg-[#ECFDF3] text-[#067647]',
      secondary: 'border-secondary bg-secondary/10 text-secondary',
      success: 'border-green-500 bg-green-50 text-green-700',
      danger: 'border-red-500 bg-red-50 text-red-700',
      warning: 'border-yellow-500 bg-yellow-50 text-yellow-700',
      info: 'border-blue-500 bg-blue-50 text-blue-700',
    };
    
    return styles[variant as keyof typeof styles] || styles.primary;
  }