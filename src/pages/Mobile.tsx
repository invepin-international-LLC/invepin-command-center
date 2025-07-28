import { MobileBartenderInterface } from "@/components/mobile/MobileBartenderInterface";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Bartender } from "@/types/bar";

const MobilePage = () => {
  const { toast } = useToast();
  
  // Mock bartenders data - in real app this would come from your API
  const [bartenders, setBartenders] = useState<Bartender[]>([
    {
      id: '1',
      name: 'Alex Rodriguez',
      isOnShift: false,
      shiftStart: undefined,
      pourAccuracy: 94,
      todayPours: 0,
      avatar: '/placeholder.svg'
    },
    {
      id: '2', 
      name: 'Sarah Chen',
      isOnShift: false,
      shiftStart: undefined,
      pourAccuracy: 98,
      todayPours: 0,
      avatar: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Mike Johnson', 
      isOnShift: false,
      shiftStart: undefined,
      pourAccuracy: 89,
      todayPours: 0,
      avatar: '/placeholder.svg'
    }
  ]);

  const handleClockIn = (bartenderId: string, method: 'face_recognition' | 'manual' = 'manual', confidence?: number) => {
    setBartenders(prev => prev.map(b => 
      b.id === bartenderId 
        ? { ...b, isOnShift: true, shiftStart: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
        : b
    ));
    
    const bartender = bartenders.find(b => b.id === bartenderId);
    const methodText = method === 'face_recognition' ? 'via face recognition' : 'manually';
    const confidenceText = confidence ? ` (${(confidence * 100).toFixed(1)}% confidence)` : '';
    
    toast({
      title: "Shift Started",
      description: `${bartender?.name} clocked in ${methodText}${confidenceText}`,
    });
  };

  const handleClockOut = (bartenderId: string, method: 'face_recognition' | 'manual' = 'manual', confidence?: number) => {
    setBartenders(prev => prev.map(b => 
      b.id === bartenderId 
        ? { ...b, isOnShift: false, shiftStart: undefined }
        : b
    ));
    
    const bartender = bartenders.find(b => b.id === bartenderId);
    const methodText = method === 'face_recognition' ? 'via face recognition' : 'manually';
    const confidenceText = confidence ? ` (${(confidence * 100).toFixed(1)}% confidence)` : '';
    
    toast({
      title: "Shift Ended", 
      description: `${bartender?.name} clocked out ${methodText}${confidenceText}`,
    });
  };

  return (
    <MobileBartenderInterface 
      bartenders={bartenders}
      onClockIn={handleClockIn}
      onClockOut={handleClockOut}
    />
  );
};

export default MobilePage;