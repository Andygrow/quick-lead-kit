import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Users, 
  MessageSquare, 
  Lightbulb, 
  Clock, 
  BarChart3, 
  Heart,
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  Trophy,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Confetti from '@/components/ui/confetti';
import CI7RadarChart from './CI7RadarChart';
import { supabase } from '@/integrations/supabase/client';
import { useUTMParams } from '@/hooks/useUTMParams';
import constanzaProfile from '@/assets/constanza/constanza-profile.png';

// The 7 steps of CI+7 methodology
const CI7_STEPS = [
  {
    id: 1,
    step: "Paso 1",
    title: "Objetivo y Audiencia",
    icon: Target,
    color: "from-primary to-primary/80",
    question: "¿Tienes claramente definido tu objetivo en LinkedIn y quién es tu cliente ideal?",
    options: [
      { value: 1, label: "No tengo claro mi objetivo ni mi audiencia" },
      { value: 2, label: "Tengo una idea general pero no está bien definido" },
      { value: 3, label: "Tengo mi objetivo pero me falta definir bien mi audiencia" },
      { value: 4, label: "Tengo ambos definidos pero no los aplico consistentemente" },
      { value: 5, label: "Tengo objetivo y audiencia 100% definidos y alineados" }
    ],
    recommendation: {
      low: "Necesitas definir urgentemente tu POR QUÉ y A QUIÉN. Sin esto, todo tu esfuerzo en LinkedIn será disperso.",
      medium: "Tienes una base, pero debes ser más específico. Define con precisión a tu cliente ideal.",
      high: "¡Excelente! Mantienes el enfoque. Revisa periódicamente si tu audiencia sigue siendo la correcta."
    }
  },
  {
    id: 2,
    step: "Paso 2",
    title: "Perfil Optimizado",
    icon: Users,
    color: "from-accent to-accent/80",
    question: "¿Tu perfil de LinkedIn funciona como una landing page que atrae a tu cliente ideal?",
    options: [
      { value: 1, label: "Mi perfil parece un CV tradicional" },
      { value: 2, label: "Tiene algo de información pero no está optimizado" },
      { value: 3, label: "He mejorado algunas secciones pero falta trabajo" },
      { value: 4, label: "Está bastante optimizado pero puedo mejorarlo" },
      { value: 5, label: "Mi perfil es una landing page perfecta para mi cliente ideal" }
    ],
    recommendation: {
      low: "Tu perfil necesita una transformación completa. Deja de verlo como CV y conviértelo en un imán de clientes.",
      medium: "Vas por buen camino. Enfócate en tu titular y sección 'Acerca de' para comunicar tu valor.",
      high: "¡Tu perfil está trabajando para ti! Actualízalo cada 3 meses con logros recientes."
    }
  },
  {
    id: 3,
    step: "Paso 3",
    title: "Red de Calidad",
    icon: Heart,
    color: "from-primary to-primary/80",
    question: "¿Estás construyendo activamente una red de contactos alineada con tus objetivos?",
    options: [
      { value: 1, label: "Acepto cualquier solicitud sin estrategia" },
      { value: 2, label: "Conecto ocasionalmente pero sin un plan" },
      { value: 3, label: "Intento conectar con mi audiencia pero no consistentemente" },
      { value: 4, label: "Conecto 5-10 personas de mi audiencia por semana" },
      { value: 5, label: "Conecto 10-15 personas de mi audiencia DIARIAMENTE" }
    ],
    recommendation: {
      low: "Tu red no te está generando oportunidades. Empieza a conectar estratégicamente con tu público objetivo.",
      medium: "Tienes que aumentar el ritmo. Apunta a 150-200 contactos de calidad por mes.",
      high: "¡Estás construyendo una red poderosa! Mantén la consistencia y cultiva esas relaciones."
    }
  },
  {
    id: 4,
    step: "Paso 4",
    title: "Networking e Interacción",
    icon: MessageSquare,
    color: "from-accent to-accent/80",
    question: "¿Interactúas regularmente con contenido de otros y generas conversaciones genuinas?",
    options: [
      { value: 1, label: "Solo consumo contenido, no interactúo" },
      { value: 2, label: "Doy likes pero casi nunca comento" },
      { value: 3, label: "Comento ocasionalmente cuando algo me interesa" },
      { value: 4, label: "Comento 2-4 veces por día de forma estratégica" },
      { value: 5, label: "Comento 5-10 veces diarias y genero conversaciones por DM" }
    ],
    recommendation: {
      low: "Estás invisible en LinkedIn. Los comentarios estratégicos son tu mejor herramienta de visibilidad.",
      medium: "Buen inicio. Aumenta tus comentarios y hazlos más valiosos, no solo 'Gran post!'.",
      high: "¡Eres un networker activo! Sigue generando relaciones genuinas, no transaccionales."
    }
  },
  {
    id: 5,
    step: "Paso 5",
    title: "Contenido de Valor",
    icon: Lightbulb,
    color: "from-primary to-primary/80",
    question: "¿Publicas contenido de valor regularmente que resuena con tu audiencia?",
    options: [
      { value: 1, label: "No publico nada o muy rara vez" },
      { value: 2, label: "Publico 1-2 veces al mes sin estrategia" },
      { value: 3, label: "Publico 1 vez por semana aproximadamente" },
      { value: 4, label: "Publico 2-3 veces por semana con buena respuesta" },
      { value: 5, label: "Publico 3+ veces por semana con estrategia clara y buen engagement" }
    ],
    recommendation: {
      low: "Sin contenido eres invisible. Empieza con 2 publicaciones semanales compartiendo tu experiencia.",
      medium: "Tienes presencia pero necesitas más consistencia. Crea un calendario editorial.",
      high: "¡Tu contenido está generando impacto! Experimenta con diferentes formatos para maximizar alcance."
    }
  },
  {
    id: 6,
    step: "Paso 6",
    title: "Consistencia y Tiempo",
    icon: Clock,
    color: "from-accent to-accent/80",
    question: "¿Dedicas tiempo diario y consistente a tu estrategia de LinkedIn?",
    options: [
      { value: 1, label: "Entro esporádicamente, sin rutina" },
      { value: 2, label: "Algunos días reviso pero sin constancia" },
      { value: 3, label: "Intento entrar varios días por semana" },
      { value: 4, label: "Dedico 10-15 minutos diarios con cierta regularidad" },
      { value: 5, label: "Dedico 20+ minutos diarios de forma consistente" }
    ],
    recommendation: {
      low: "La inconsistencia mata cualquier estrategia. LinkedIn requiere presencia diaria, aunque sea breve.",
      medium: "Estás cerca. Bloquea 20 minutos diarios en tu calendario como cita innegociable.",
      high: "¡La consistencia es tu superpoder! Mantén el hábito y los resultados llegarán."
    }
  },
  {
    id: 7,
    step: "Paso 7",
    title: "Medición de Resultados",
    icon: BarChart3,
    color: "from-primary to-primary/80",
    question: "¿Mides y analizas regularmente tus métricas y resultados en LinkedIn?",
    options: [
      { value: 1, label: "No mido nada, no sé dónde ver estadísticas" },
      { value: 2, label: "A veces veo las estadísticas pero no las analizo" },
      { value: 3, label: "Reviso métricas ocasionalmente sin un sistema" },
      { value: 4, label: "Analizo mis métricas semanalmente" },
      { value: 5, label: "Llevo registro semanal de métricas y ajusto mi estrategia según datos" }
    ],
    recommendation: {
      low: "Lo que no mides, no mejora. Empieza a revisar tus estadísticas de LinkedIn semanalmente.",
      medium: "Buen hábito. Ahora crea un documento donde registres tus métricas cada semana.",
      high: "¡Eres data-driven! Sigue optimizando basándote en lo que funciona mejor."
    }
  }
];

// Contact info schema
const contactInfoSchema = z.object({
  name: z.string().min(2, 'Ingresa tu nombre completo').max(100),
  email: z.string().email('Ingresa un email válido').max(255),
  phone: z.string().max(20).optional().or(z.literal('')),
  company: z.string().min(1, 'Ingresa tu empresa o actividad').max(100),
});

type ContactInfoData = z.infer<typeof contactInfoSchema>;

interface CI7QuizProps {
  onComplete: (data: ContactInfoData) => void;
}

type QuizStep = 'intro' | 'questions' | 'result' | 'contact' | 'success';

const CI7Quiz = ({ onComplete }: CI7QuizProps) => {
  const [step, setStep] = useState<QuizStep>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utmParams = useUTMParams();

  const contactForm = useForm<ContactInfoData>({
    resolver: zodResolver(contactInfoSchema),
  });

  // Calculate total score and level
  const calculateScore = () => {
    let total = 0;
    Object.values(answers).forEach((value) => {
      total += value;
    });
    return total;
  };

  const getScorePerStep = (stepId: number) => {
    return answers[stepId] || 0;
  };

  const getOverallLevel = () => {
    const score = calculateScore();
    const maxScore = CI7_STEPS.length * 5; // 35
    const percentage = (score / maxScore) * 100;

    if (percentage >= 75) {
      return {
        level: 'advanced',
        title: 'Nivel Avanzado',
        subtitle: '¡Estás en el camino correcto!',
        description: 'Tu estrategia de LinkedIn está bien encaminada. Tienes las bases sólidas y solo necesitas optimizar algunos detalles para maximizar resultados.',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
        icon: Trophy,
      };
    } else if (percentage >= 50) {
      return {
        level: 'intermediate',
        title: 'Nivel Intermedio',
        subtitle: 'Buen progreso, pero hay oportunidades',
        description: 'Tienes algunas áreas fuertes pero otras necesitan trabajo. Con los ajustes correctos, puedes multiplicar tus resultados.',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
        icon: AlertCircle,
      };
    } else {
      return {
        level: 'beginner',
        title: 'Nivel Inicial',
        subtitle: 'Gran potencial de mejora',
        description: 'Tu estrategia de LinkedIn necesita una transformación. La buena noticia es que tienes mucho espacio para crecer y la metodología CI+7 puede ayudarte.',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/20',
        icon: AlertTriangle,
      };
    }
  };

  const getStepRecommendation = (stepId: number) => {
    const score = getScorePerStep(stepId);
    const stepData = CI7_STEPS.find(s => s.id === stepId);
    if (!stepData) return '';
    
    if (score <= 2) return stepData.recommendation.low;
    if (score <= 4) return stepData.recommendation.medium;
    return stepData.recommendation.high;
  };

  const getWeakestSteps = () => {
    return CI7_STEPS
      .map(s => ({ ...s, score: getScorePerStep(s.id) }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
  };

  const handleStartQuiz = () => {
    setStep('questions');
  };

  const handleAnswer = (value: string) => {
    const numValue = parseInt(value, 10);
    setAnswers({ ...answers, [CI7_STEPS[currentQuestion].id]: numValue });
  };

  const handleNext = () => {
    if (currentQuestion < CI7_STEPS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('result');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / CI7_STEPS.length) * 100;
  const currentAnswer = answers[CI7_STEPS[currentQuestion]?.id];

  // Submit contact info
  const onSubmitContact = async (data: ContactInfoData) => {
    setIsSubmitting(true);
    
    const level = getOverallLevel();
    const score = calculateScore();
    const weakSteps = getWeakestSteps();
    
    try {
      // Use edge function to handle lead registration (handles deduplication internally)
      const { data: result, error: registerError } = await supabase.functions.invoke('register-lead', {
        body: {
          name: data.name,
          email: data.email.trim().toLowerCase(),
          phone: data.phone || null,
          company: data.company,
          source: 'quiz',
          quiz_score: score,
          quiz_level: level.level,
          quiz_answers: answers,
          utm_source: utmParams.utm_source || null,
          utm_medium: utmParams.utm_medium || null,
          utm_campaign: utmParams.utm_campaign || null,
          utm_term: utmParams.utm_term || null,
        },
      });

      if (registerError) {
        console.error('Error registering lead:', registerError);
      } else {
        console.log('Lead registration result:', result);
        
        // Send welcome email with the guide
        const leadQualityValue = level.level === 'beginner' || level.level === 'intermediate' ? 'high' : 'medium';
        try {
          const { error: emailError } = await supabase.functions.invoke('send-lead-email', {
            body: {
              name: data.name,
              email: data.email,
              resourceName: 'Guía de Social Selling CI+7',
              leadQuality: leadQualityValue,
              adminEmail: result?.isCorporateEmail ? 'contacto@elevateyconecta.com' : undefined,
              leadId: result?.leadId,
            },
          });
          
          if (emailError) {
            console.error('Error sending email:', emailError);
          } else {
            console.log('Welcome email sent successfully');
          }
        } catch (emailErr) {
          console.error('Error invoking email function:', emailErr);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
    
    setIsSubmitting(false);
    setStep('success');
    onComplete(data);
  };

  // INTRO STEP
  if (step === 'intro') {
    return (
      <div className="text-center py-2">
        {/* Animated header badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative inline-block mb-6"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full blur-lg opacity-50 animate-pulse" />
          <div className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-accent/30">
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            <span className="text-sm font-bold text-accent">Quiz CI+7</span>
          </div>
        </motion.div>

        {/* Main title with better contrast */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl sm:text-3xl font-bold mb-3"
        >
          <span className="text-foreground">
            ¿Qué tan fuerte es tu
          </span>
          <br />
          <span className="text-accent">
            estrategia LinkedIn?
          </span>
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-foreground/80 mb-8 max-w-xs mx-auto"
        >
          Evalúa tu nivel con los <strong className="text-accent font-semibold">7 pasos</strong> de la metodología CI+7
        </motion.p>

        {/* Animated steps preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {CI7_STEPS.map((stepItem, index) => {
            const Icon = stepItem.icon;
            return (
              <motion.div
                key={stepItem.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05, type: "spring" }}
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stepItem.color} flex items-center justify-center shadow-lg`}
              >
                <Icon className="w-5 h-5 text-white" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Benefits list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-2 mb-8"
        >
          {[
            { icon: Target, text: "Diagnóstico completo en 2 min" },
            { icon: Zap, text: "Resultados personalizados" },
            { icon: Trophy, text: "Plan de acción inmediato" }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center gap-3 p-2"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-foreground font-medium">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button with glow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur-xl opacity-40" />
          <Button
            onClick={handleStartQuiz}
            className="relative w-full h-14 text-base font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-xl shadow-2xl"
          >
            <span className="mr-2">🚀</span>
            Comenzar Evaluación
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-foreground/60 mt-4"
        >
          +3,500 profesionales han completado este quiz
        </motion.p>
      </div>
    );
  }

  // QUESTIONS STEP - Simplified and User-Friendly
  if (step === 'questions') {
    const questionData = CI7_STEPS[currentQuestion];
    const StepIcon = questionData.icon;

    return (
      <div className="py-2">
        {/* Compact progress indicator */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              {currentQuestion + 1}/{CI7_STEPS.length}
            </span>
            <span className="text-xs font-bold text-accent">
              {Math.round(progress)}%
            </span>
          </div>
          
          {/* Clean progress bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step header - inline compact */}
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${questionData.color} flex items-center justify-center`}>
                <StepIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-semibold text-accent uppercase">{questionData.step}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-sm font-medium text-foreground">{questionData.title}</span>
            </div>

            {/* Question - compact */}
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-4 leading-snug">
              {questionData.question}
            </h3>

            {/* Compact options */}
            <div className="space-y-2">
              {questionData.options.map((option, idx) => {
                const isSelected = currentAnswer === option.value;
                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => handleAnswer(option.value.toString())}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`w-full text-left py-2.5 px-3 rounded-lg border transition-all duration-150 ${
                      isSelected
                        ? 'border-accent bg-accent/20'
                        : 'border-border bg-muted/50 hover:border-primary/50 hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Simple radio circle */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected 
                          ? 'border-accent bg-accent' 
                          : 'border-muted-foreground/40'
                      }`}>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      
                      {/* Option text */}
                      <span className={`text-sm flex-1 ${
                        isSelected ? 'text-foreground font-medium' : 'text-foreground/80'
                      }`}>
                        {option.label}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Compact navigation buttons */}
        <div className="flex gap-2 mt-5">
          {currentQuestion > 0 && (
            <Button
              onClick={handleBack}
              variant="outline"
              size="sm"
              className="h-10 px-4 text-sm font-medium border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Atrás
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!currentAnswer}
            size="sm"
            className={`flex-1 h-10 text-sm font-bold rounded-lg ${
              currentAnswer 
                ? 'bg-gradient-to-r from-primary to-accent text-white' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {currentQuestion < CI7_STEPS.length - 1 ? (
              <>
                Continuar
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </>
            ) : (
              <>
                <Trophy className="mr-1.5 h-4 w-4" />
                Ver Resultados
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // RESULT STEP - With Radar Chart
  if (step === 'result') {
    const level = getOverallLevel();
    const LevelIcon = level.icon;
    const score = calculateScore();
    const maxScore = CI7_STEPS.length * 5;
    const percentage = Math.round((score / maxScore) * 100);
    const weakestSteps = getWeakestSteps();

    // Prepare data for radar chart
    const radarData = CI7_STEPS.map(s => ({
      id: s.id,
      title: s.title,
      score: getScorePerStep(s.id),
      maxScore: 5
    }));

    return (
      <div className="py-2 relative">
        {/* Confetti celebration */}
        <Confetti count={40} duration={2.5} />
        
        {/* Header with level badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4 relative z-20"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${level.bgColor} border ${level.borderColor} mb-2`}>
            <LevelIcon className={`w-4 h-4 ${level.color}`} />
            <span className={`text-sm font-bold ${level.color}`}>{level.title}</span>
          </div>
          <p className="text-base font-semibold text-foreground">{level.subtitle}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Puntaje: <span className="font-bold text-primary">{score}/{maxScore}</span> ({percentage}%)
          </p>
        </motion.div>

        {/* Radar Chart - Character Stats Style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-8 relative z-20"
        >
          <CI7RadarChart scores={radarData} size={220} animated={true} />
        </motion.div>

        {/* Legend - Step names */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 gap-x-3 gap-y-1 mb-4 relative z-20"
        >
          {CI7_STEPS.map((s) => {
            const stepScore = getScorePerStep(s.id);
            const Icon = s.icon;
            const isWeak = stepScore <= 2;
            
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-[9px] font-bold text-white">{s.id}</span>
                </div>
                <span className={`text-[11px] truncate ${isWeak ? 'text-accent font-medium' : 'text-muted-foreground'}`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* Priority recommendation - compact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className={`p-3 rounded-lg border ${level.borderColor} ${level.bgColor} mb-4 relative z-20`}
        >
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-foreground">
                🎯 Enfócate en: {weakestSteps[0]?.title}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {getStepRecommendation(weakestSteps[0]?.id)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA - compact */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          className="relative z-20"
        >
          <p className="text-xs text-muted-foreground text-center mb-2">
            Descarga la Guía para mejorar cada paso 🎁
          </p>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg blur-md opacity-40 animate-pulse" />
            <Button
              onClick={() => setStep('contact')}
              className="relative w-full h-12 text-sm font-bold bg-gradient-to-r from-primary to-accent text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Obtener Guía CI+7 Gratis
            </Button>
          </div>
        </motion.div>

        {/* Masterclass CTA - After quiz results */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-4 pt-4 border-t border-border/30 relative z-20"
        >
          <a 
            href="/masterclass"
            className="flex items-center gap-3 p-3 rounded-xl bg-accent/10 border border-accent/30 hover:bg-accent/15 transition-colors group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-5 h-5 text-accent" />
            </div>
            <div className="text-left flex-1">
              <p className="text-xs font-bold text-accent">
                🎬 Masterclass Disponible en Grabado
              </p>
              <p className="text-[11px] text-muted-foreground">
                Aprende a mejorar tu {weakestSteps[0]?.title} y más
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    );
  }

  // CONTACT STEP
  if (step === 'contact') {
    return (
      <div>
        <div className="text-center mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
            Último paso para tu Guía CI+7
          </h3>
          <p className="text-sm text-muted-foreground">
            Te enviaremos la guía junto con recomendaciones basadas en tus resultados.
          </p>
        </div>

        <form onSubmit={contactForm.handleSubmit(onSubmitContact)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-foreground font-medium text-sm">
              Tu nombre completo *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="María González"
              {...contactForm.register('name')}
              className="h-11 text-sm border border-border bg-background text-foreground placeholder:text-muted-foreground"
            />
            {contactForm.formState.errors.name && (
              <p className="text-destructive text-xs">{contactForm.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-foreground font-medium text-sm">
              Tu correo electrónico *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              {...contactForm.register('email')}
              className="h-11 text-sm border border-border bg-background text-foreground placeholder:text-muted-foreground"
            />
            {contactForm.formState.errors.email && (
              <p className="text-destructive text-xs">{contactForm.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-foreground font-medium text-sm">
              WhatsApp (opcional)
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+56 9 1234 5678"
              {...contactForm.register('phone')}
              className="h-11 text-sm border border-border bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company" className="text-foreground font-medium text-sm">
              Empresa o actividad *
            </Label>
            <Input
              id="company"
              type="text"
              placeholder="Ej: Consultor de Marketing"
              {...contactForm.register('company')}
              className="h-11 text-sm border border-border bg-background text-foreground placeholder:text-muted-foreground"
            />
            {contactForm.formState.errors.company && (
              <p className="text-destructive text-xs">{contactForm.formState.errors.company.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-sm font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              'Obtener Mi Guía CI+7 Gratis'
            )}
          </Button>

          <p className="text-[10px] text-center text-muted-foreground">
            Al continuar, aceptas recibir comunicaciones sobre la metodología CI+7.
          </p>
        </form>
      </div>
    );
  }

  // SUCCESS STEP
  if (step === 'success') {
    const level = getOverallLevel();
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>

        <h3 className="text-xl font-bold text-foreground mb-2">
          ¡Tu plan está en camino!
        </h3>
        
        <p className="text-sm text-muted-foreground mb-6">
          Revisa tu correo para recibir recomendaciones personalizadas basadas en tu {level.title.toLowerCase()}.
        </p>

        {/* Author card */}
        <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/30">
          <img 
            src={constanzaProfile} 
            alt="Constanza Ibieta" 
            className="w-16 h-16 rounded-full object-cover object-top border-2 border-accent"
          />
          <div>
            <p className="text-sm font-semibold text-accent">Constanza Ibieta Illanes</p>
            <p className="text-xs text-muted-foreground">#1 Favikon: Marca Personal & Creadora de Audiencia</p>
          </div>
          <p className="text-xs text-muted-foreground italic">
            "Te ayudaré a implementar cada paso de la metodología CI+7"
          </p>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default CI7Quiz;
