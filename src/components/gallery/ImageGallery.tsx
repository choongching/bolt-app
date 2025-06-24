import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, ExternalLink, Heart, Grid, List, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { pexelsService } from '@/services/pexelsService';

interface GalleryImage {
  id: string;
  url: string;
  thumbnail: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
  avgColor: string;
  aspectRatio: number;
}

interface ImageGalleryProps {
  destination: string;
  country: string;
  className?: string;
}

type GalleryLayout = 'masonry' | 'grid' | 'carousel' | 'featured';

const ImageGallery: React.FC<ImageGalleryProps> = ({ destination, country, className = '' }) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [layout, setLayout] = useState<GalleryLayout>('masonry');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadImages();
  }, [destination, country]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const galleryImages = await pexelsService.getDestinationImages(destination, country, 16);
      setImages(galleryImages);
    } catch (error) {
      console.error('Failed to load gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + images.length) % images.length
      : (currentIndex + 1) % images.length;
    
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const toggleFavorite = (imageId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(imageId)) {
      newFavorites.delete(imageId);
    } else {
      newFavorites.add(imageId);
    }
    setFavorites(newFavorites);
  };

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Camera className="w-6 h-6 text-white" />
            <h3 className="text-2xl font-bold text-white">Photo Gallery</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-white/10 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Gallery Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Camera className="w-6 h-6 text-white" />
          <h3 className="text-2xl font-bold text-white">Photo Gallery</h3>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {images.length} photos
          </Badge>
        </div>
        
        {/* Layout Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant={layout === 'masonry' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLayout('masonry')}
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={layout === 'carousel' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLayout('carousel')}
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Gallery Content */}
      {layout === 'masonry' && (
        <MasonryGallery 
          images={images} 
          onImageClick={openLightbox}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {layout === 'carousel' && (
        <CarouselGallery 
          images={images} 
          onImageClick={openLightbox}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <Lightbox
            image={selectedImage}
            currentIndex={currentIndex}
            totalImages={images.length}
            onClose={closeLightbox}
            onNavigate={navigateImage}
            onDownload={downloadImage}
            isFavorite={favorites.has(selectedImage.id)}
            onToggleFavorite={() => toggleFavorite(selectedImage.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Masonry Grid Layout
const MasonryGallery: React.FC<{
  images: GalleryImage[];
  onImageClick: (image: GalleryImage, index: number) => void;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}> = ({ images, onImageClick, favorites, onToggleFavorite }) => {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="break-inside-avoid mb-4 group relative cursor-pointer"
          onClick={() => onImageClick(image, index)}
        >
          <div className="relative overflow-hidden rounded-lg shadow-lg">
            <img
              src={image.thumbnail}
              alt={image.alt}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: image.avgColor }}
              loading="lazy"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(image.id);
                  }}
                >
                  <Heart className={`w-4 h-4 ${favorites.has(image.id) ? 'fill-current text-red-500' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Photographer Credit */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-xs">
                Photo by{' '}
                <a
                  href={image.photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  {image.photographer}
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Carousel Layout
const CarouselGallery: React.FC<{
  images: GalleryImage[];
  onImageClick: (image: GalleryImage, index: number) => void;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}> = ({ images, onImageClick, favorites, onToggleFavorite }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const imagesPerSlide = 3;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(images.length / imagesPerSlide));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(images.length / imagesPerSlide)) % Math.ceil(images.length / imagesPerSlide));
  };

  return (
    <div className="relative">
      {/* Featured Image */}
      <div className="mb-6">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="aspect-video rounded-xl overflow-hidden relative group cursor-pointer"
          onClick={() => onImageClick(images[currentSlide * imagesPerSlide], currentSlide * imagesPerSlide)}
        >
          <img
            src={images[currentSlide * imagesPerSlide]?.url}
            alt={images[currentSlide * imagesPerSlide]?.alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h4 className="text-xl font-semibold mb-1">Featured Photo</h4>
            <p className="text-sm opacity-90">
              by {images[currentSlide * imagesPerSlide]?.photographer}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Thumbnail Strip */}
      <div className="relative">
        <div className="flex space-x-4 overflow-hidden">
          {images.slice(currentSlide * imagesPerSlide, (currentSlide + 1) * imagesPerSlide).map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-1 aspect-square rounded-lg overflow-hidden relative group cursor-pointer"
              onClick={() => onImageClick(image, currentSlide * imagesPerSlide + index)}
            >
              <img
                src={image.thumbnail}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
          onClick={nextSlide}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: Math.ceil(images.length / imagesPerSlide) }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white/40'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Lightbox Component
const Lightbox: React.FC<{
  image: GalleryImage;
  currentIndex: number;
  totalImages: number;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onDownload: (url: string, filename: string) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}> = ({ image, currentIndex, totalImages, onClose, onNavigate, onDownload, isFavorite, onToggleFavorite }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-6xl max-h-full" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-black/50 border-white/30 text-white hover:bg-black/70"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 border-white/30 text-white hover:bg-black/70"
          onClick={() => onNavigate('prev')}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 border-white/30 text-white hover:bg-black/70"
          onClick={() => onNavigate('next')}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Image */}
        <motion.img
          key={image.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={image.url}
          alt={image.alt}
          className="max-w-full max-h-full object-contain rounded-lg"
        />

        {/* Image Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-lg font-medium mb-1">{image.alt}</p>
              <p className="text-white/80 text-sm">
                Photo by{' '}
                <a
                  href={image.photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-300"
                >
                  {image.photographer}
                </a>
              </p>
              <p className="text-white/60 text-xs mt-1">
                {currentIndex + 1} of {totalImages}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-black/50 border-white/30 text-white hover:bg-black/70"
                onClick={onToggleFavorite}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-black/50 border-white/30 text-white hover:bg-black/70"
                onClick={() => onDownload(image.url, `${image.alt}.jpg`)}
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-black/50 border-white/30 text-white hover:bg-black/70"
                onClick={() => window.open(image.photographerUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageGallery;