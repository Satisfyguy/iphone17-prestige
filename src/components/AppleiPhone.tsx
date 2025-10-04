interface AppleiPhoneProps {
  model: string;
  color: string;
  orientation: 'front' | 'back';
}

export const AppleiPhone = ({ model, color, orientation }: AppleiPhoneProps) => {
  const getColorClasses = (colorChoice: string) => {
    switch (colorChoice) {
      case 'orange':
        return {
          background: 'bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700',
          border: 'border-orange-400',
          shadow: 'shadow-orange-200'
        };
      case 'blue':
        return {
          background: 'bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900',
          border: 'border-blue-600',
          shadow: 'shadow-blue-200'
        };
      case 'lavender':
        return {
          background: 'bg-gradient-to-b from-purple-300 via-purple-400 to-purple-500',
          border: 'border-purple-300',
          shadow: 'shadow-purple-200'
        };
      case 'silver':
        return {
          background: 'bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400',
          border: 'border-gray-300',
          shadow: 'shadow-gray-200'
        };
      default:
        return {
          background: 'bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500',
          border: 'border-gray-300',
          shadow: 'shadow-gray-200'
        };
    }
  };

  const colors = getColorClasses(color);

  return (
    <div className="relative mx-auto">
      {/* iPhone Body */}
      <div className={`relative w-16 h-28 rounded-3xl ${colors.background} ${colors.border} border-2 ${colors.shadow} shadow-xl`}>
        
        {orientation === 'front' ? (
          // Front view with Dynamic Island
          <>
            {/* Screen */}
            <div className="absolute inset-1 bg-black rounded-2xl overflow-hidden">
              {/* Dynamic Island */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-white rounded-full"></div>
              
              {/* Wallpaper Pattern */}
              <div className="absolute inset-0 opacity-20">
                {color === 'orange' && (
                  <div className="w-full h-full bg-gradient-to-br from-orange-200 via-white to-orange-300 opacity-60" />
                )}
                {color === 'blue' && (
                  <div className="w-full h-full bg-gradient-to-br from-blue-200 via-white to-blue-300 opacity-60" />
                )}
                {color === 'lavender' && (
                  <div className="w-full h-full bg-gradient-to-br from-purple-200 via-white to-purple-300 opacity-60" />
                )}
                {color === 'silver' && (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 via-white to-gray-200 opacity-60" />
                )}
              </div>
            </div>
          </>
        ) : (
          // Back view with camera system
          <>
            {/* Apple Logo */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full"></div>
            
            {/* Camera Module */}
            <div className="absolute top-2 left-2 w-6 h-6 bg-gray-900 rounded-lg">
              {/* Main Camera */}
              <div className="absolute top-1 left-1 w-2 h-2 bg-gray-600 rounded-full"></div>
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
              {/* Flash/LiDAR */}
              <div className="absolute bottom-1 left-1 w-1.5 h-1 bg-gray-400 rounded"></div>
            </div>
          </>
        )}
        
        {/* Side Buttons */}
        <div className="absolute left-0 top-8 w-0.5 h-4 bg-gray-800 rounded-l-full"></div>
        <div className="absolute right-0 top-10 w-0.5 h-6 bg-gray-800 rounded-r-full"></div>
        <div className="absolute right-0 top-16 w-0.5 h-8 bg-gray-800 rounded-r-full"></div>
      </div>
      
      {/* Subtle shadow underneath */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-14 h-2 bg-black/20 rounded-full blur-sm"></div>
    </div>
  );
};
