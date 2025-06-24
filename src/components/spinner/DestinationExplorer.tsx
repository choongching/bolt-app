import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Utensils, 
  Bed, 
  Camera,
  Star,
  DollarSign,
  Users,
  Plane,
  Images
} from 'lucide-react';
import { Destination } from '@/types/destination';
import ImageGallery from '@/components/gallery/ImageGallery';

interface DestinationExplorerProps {
  destination: Destination;
  onBack: () => void;
  onSave: () => void;
}

const DestinationExplorer: React.FC<DestinationExplorerProps> = ({
  destination,
  onBack,
  onSave
}) => {
  const [activeDay, setActiveDay] = useState(1);

  // Mock itinerary data
  const itinerary = {
    day1: {
      title: "Arrival & First Impressions",
      activities: [
        { time: "09:00", activity: "Airport pickup and hotel check-in", icon: Plane },
        { time: "12:00", activity: "Welcome lunch at local restaurant", icon: Utensils },
        { time: "15:00", activity: "City orientation walk", icon: MapPin },
        { time: "18:00", activity: "Sunset viewing at famous viewpoint", icon: Camera },
        { time: "20:00", activity: "Traditional dinner experience", icon: Utensils }
      ]
    },
    day2: {
      title: "Cultural Immersion",
      activities: [
        { time: "08:00", activity: "Breakfast at hotel", icon: Utensils },
        { time: "09:30", activity: "Guided cultural tour", icon: Users },
        { time: "13:00", activity: "Local market exploration", icon: MapPin },
        { time: "16:00", activity: "Traditional craft workshop", icon: Star },
        { time: "19:00", activity: "Cultural show and dinner", icon: Calendar }
      ]
    },
    day3: {
      title: "Adventure & Departure",
      activities: [
        { time: "07:00", activity: "Early morning adventure activity", icon: Star },
        { time: "11:00", activity: "Souvenir shopping", icon: MapPin },
        { time: "14:00", activity: "Farewell lunch", icon: Utensils },
        { time: "16:00", activity: "Hotel checkout", icon: Bed },
        { time: "18:00", activity: "Airport transfer", icon: Plane }
      ]
    }
  };

  const accommodations = [
    {
      name: "Luxury Resort & Spa",
      type: "5-star Resort",
      price: "$200-400/night",
      features: ["Ocean view", "Spa services", "Pool", "Restaurant"]
    },
    {
      name: "Boutique Hotel",
      type: "4-star Hotel",
      price: "$120-250/night",
      features: ["City center", "Rooftop bar", "Gym", "Concierge"]
    },
    {
      name: "Local Guesthouse",
      type: "3-star B&B",
      price: "$60-120/night",
      features: ["Authentic experience", "Breakfast included", "Local guides", "Garden"]
    }
  ];

  const restaurants = [
    {
      name: "Fine Dining Experience",
      cuisine: "Local Fusion",
      price: "$$$",
      specialty: "Signature tasting menu with local ingredients"
    },
    {
      name: "Traditional Tavern",
      cuisine: "Authentic Local",
      price: "$$",
      specialty: "Family recipes passed down generations"
    },
    {
      name: "Street Food Market",
      cuisine: "Various",
      price: "$",
      specialty: "Best local street food and snacks"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={destination.image_url || 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg'}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Button
                onClick={onBack}
                variant="outline"
                className="mb-6 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Results
              </Button>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                {destination.name}
              </h1>
              <p className="text-xl text-white/90 mb-4">{destination.tagline}</p>
              <p className="text-white/80">{destination.description}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <Tabs defaultValue="gallery" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="gallery" className="text-white data-[state=active]:bg-white/20">
              <Images className="w-4 h-4 mr-2" />
              Photo Gallery
            </TabsTrigger>
            <TabsTrigger value="itinerary" className="text-white data-[state=active]:bg-white/20">
              3-Day Itinerary
            </TabsTrigger>
            <TabsTrigger value="accommodations" className="text-white data-[state=active]:bg-white/20">
              Accommodations
            </TabsTrigger>
            <TabsTrigger value="dining" className="text-white data-[state=active]:bg-white/20">
              Dining
            </TabsTrigger>
          </TabsList>

          {/* Photo Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <ImageGallery 
              destination={destination.name}
              country={destination.country}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            />
          </TabsContent>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3].map((day) => (
                <Button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  variant={activeDay === day ? "default" : "outline"}
                  className={`p-4 h-auto ${
                    activeDay === day 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">Day {day}</div>
                    <div className="text-sm opacity-80">
                      {day === 1 && "Arrival & First Impressions"}
                      {day === 2 && "Cultural Immersion"}
                      {day === 3 && "Adventure & Departure"}
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">
                  Day {activeDay}: {
                    activeDay === 1 ? itinerary.day1.title :
                    activeDay === 2 ? itinerary.day2.title :
                    itinerary.day3.title
                  }
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(activeDay === 1 ? itinerary.day1.activities :
                  activeDay === 2 ? itinerary.day2.activities :
                  itinerary.day3.activities
                ).map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center space-x-2 mb-1">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-400 font-semibold">{item.time}</span>
                      </div>
                      <p className="text-white">{item.activity}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accommodations Tab */}
          <TabsContent value="accommodations" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {accommodations.map((hotel, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-full">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">{hotel.name}</CardTitle>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-purple-600 text-white">
                          {hotel.type}
                        </Badge>
                        <div className="flex items-center text-green-400">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span className="font-semibold">{hotel.price}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {hotel.features.map((feature, i) => (
                          <div key={i} className="flex items-center text-white/80">
                            <Star className="w-4 h-4 mr-2 text-yellow-400" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Dining Tab */}
          <TabsContent value="dining" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {restaurants.map((restaurant, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-full">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">{restaurant.name}</CardTitle>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-orange-600 text-white">
                          {restaurant.cuisine}
                        </Badge>
                        <div className="text-green-400 font-semibold">
                          {restaurant.price}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/80">{restaurant.specialty}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Button
            onClick={onSave}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-12 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Save This Adventure
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default DestinationExplorer;