import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProjectGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    client: string;
    event: string;
    type: string;
    gallery: string[];
  } | null;
}

const ProjectGalleryModal = ({ isOpen, onClose, project }: ProjectGalleryModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!project) return null;

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % project.gallery.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + project.gallery.length) % project.gallery.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 bg-background/95 backdrop-blur-xl border-primary/20 overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6 bg-gradient-to-b from-background via-background/80 to-transparent">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-primary font-medium uppercase tracking-wider">
                {project.type}
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                {project.client}
              </h2>
              <p className="text-sm text-muted-foreground">{project.event}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Image */}
        <div className="relative w-full h-full flex items-center justify-center pt-20 pb-24">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={project.gallery[currentIndex]}
              alt={`${project.client} - Imagen ${currentIndex + 1}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </AnimatePresence>

          {/* Navigation Arrows */}
          {project.gallery.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-background/80 backdrop-blur-sm border border-primary/20 hover:bg-primary/20 transition-colors z-10"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-background/80 backdrop-blur-sm border border-primary/20 hover:bg-primary/20 transition-colors z-10"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-background via-background/80 to-transparent">
          <div className="flex justify-center gap-2 overflow-x-auto pb-2">
            {project.gallery.map((img, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? "border-primary shadow-lg shadow-primary/30"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            {currentIndex + 1} / {project.gallery.length}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectGalleryModal;
