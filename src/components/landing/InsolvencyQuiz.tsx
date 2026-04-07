import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, X, ArrowRight, ArrowLeft, Loader2, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUTMParams } from '@/hooks/useUTMParams';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

// Quiz questions
const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: 'Semáforo de Deuda',
    question: '¿Tus deudas superan el 50% de tus ingresos mensuales?',
    weight: 2,
  },
  {
    id: 2,
    category: 'Semáforo de Deuda',
    question: '¿Estás usando créditos nuevos para pagar deudas antiguas?',
    weight: 3,
  },
  {
    id: 3,
    category: 'Semáforo de Deuda',
    question: '¿Llevas más de 3 meses sin poder pagar alguna cuota?',
    weight: 2,
  },
  {
    id: 4,
    category: 'Prueba del Embargo',
    question: '¿Has recibido notificaciones judiciales o cartas de cobranza legal?',
    weight: 3,
  },
  {
    id: 5,
    category: 'Prueba del Embargo',
    question: '¿Tienes bienes a tu nombre (auto, propiedad) que podrían ser embargados?',
    weight: 2,
  },
  {
    id: 6,
    category: 'Prueba del Embargo',
    question: '¿Algún acreedor ha iniciado acciones legales en tu contra?',
    weight: 4,
  },
  {
    id: 7,
    category: 'Situación Actual',
    question: '¿Estás en DICOM o tienes protestos de documentos?',
    weight: 1,
  },
  {
    id: 8,
    category: 'Situación Actual',
    question: '¿Tu situación financiera te genera ansiedad o problemas de sueño?',
    weight: 1,
  },
];

// Contact info schema (at the end)
const contactInfoSchema = z.object({
  name: z.string().min(2, 'Ingresa tu nombre completo'),
  email: z.string().email('Ingresa un email válido'),
  phone: z.string().min(8, 'Ingresa un teléfono válido'),
  debtAmount: z.string().min(1, 'Selecciona un rango de deuda'),
});

type ContactInfoData = z.infer<typeof contactInfoSchema>;

interface InsolvencyQuizProps {
  onComplete: () => void;
}

type QuizStep = 'intro' | 'questions' | 'result' | 'contact' | 'success';

export const InsolvencyQuiz = ({ onComplete }: InsolvencyQuizProps) => {
  const [step, setStep] = useState<QuizStep>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utmParams = useUTMParams();

  const contactForm = useForm<ContactInfoData>({
    resolver: zodResolver(contactInfoSchema),
  });

  // Calculate risk score
  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (answers[q.id]) {
        score += q.weight;
      }
    });
    return score;
  };

  const getRiskLevel = () => {
    const score = calculateScore();
    const maxScore = QUIZ_QUESTIONS.reduce((acc, q) => acc + q.weight, 0);
    const percentage = (score / maxScore) * 100;

    if (percentage >= 60) {
      return {
        level: 'critical',
        title: 'Riesgo Crítico',
        subtitle: 'Tu situación requiere atención inmediata',
        description: 'Basado en tus respuestas, estás en una situación de insolvencia que podría derivar en embargo. La Ley 20.720 puede protegerte, pero debes actuar ahora.',
        color: 'destructive',
        icon: AlertTriangle,
        action: 'Necesitas hablar con un abogado HOY',
      };
    } else if (percentage >= 35) {
      return {
        level: 'warning',
        title: 'Riesgo Moderado',
        subtitle: 'Señales de alerta detectadas',
        description: 'Tu situación financiera muestra señales de estrés. Si no tomas medidas preventivas, podrías entrar en una espiral de deuda difícil de revertir.',
        color: 'warning',
        icon: AlertCircle,
        action: 'Te recomendamos una evaluación preventiva',
      };
    } else {
      return {
        level: 'safe',
        title: 'Situación Manejable',
        subtitle: 'No hay señales críticas',
        description: 'Aunque puedes tener algunas deudas, tu situación parece manejable. Sin embargo, es importante mantener un control para evitar que escale.',
        color: 'success',
        icon: CheckCircle,
        action: 'Mantén el control de tus finanzas',
      };
    }
  };

  const handleStartQuiz = () => {
    setStep('questions');
  };

  const handleAnswer = (answer: boolean) => {
    setAnswers({ ...answers, [QUIZ_QUESTIONS[currentQuestion].id]: answer });
    
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
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

  // Submit contact info and create lead at the end
  const onSubmitContact = async (data: ContactInfoData) => {
    setIsSubmitting(true);
    
    const riskLevel = getRiskLevel();
    const yesCount = Object.values(answers).filter(Boolean).length;
    
    try {
      const { error } = await supabase
        .from('leads')
        .insert({
          name: data.name,
          email: data.email,
          company: 'Quiz Insolvencia',
          role: data.debtAmount === 'mas-20m' ? 'Deuda Alta (+$20M)' : 
                data.debtAmount === '5m-20m' ? 'Deuda Media ($5M-$20M)' : 'Deuda Baja (-$5M)',
          utm_source: utmParams.utm_source || null,
          utm_medium: utmParams.utm_medium || null,
          utm_campaign: utmParams.utm_campaign || null,
          utm_term: utmParams.utm_term || null,
          is_corporate_email: data.email.includes('@') && !data.email.match(/@(gmail|hotmail|yahoo|outlook)\./i),
          lead_quality: riskLevel.level === 'critical' || data.debtAmount === 'mas-20m' ? 'high' : 'low',
          pipeline_stage: 'new',
          notes: `Quiz completado - Riesgo: ${riskLevel.title} | Score: ${calculateScore()}/${QUIZ_QUESTIONS.reduce((acc, q) => acc + q.weight, 0)} | Respuestas SÍ: ${yesCount}/8 | Teléfono: ${data.phone} | Monto deuda: ${data.debtAmount}`,
        });

      if (error) {
        console.error('Error creating lead:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    
    setIsSubmitting(false);
    setStep('success');
  };

  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;

  // Intro Step
  if (step === 'intro') {
    return (
      <div className="text-center">
        <div className="inline-block px-4 py-1 bg-primary text-primary-foreground text-sm font-bold rounded mb-4">
          Quiz Gratuito
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
          Evalúa tu Riesgo de Insolvencia
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Responde 8 preguntas rápidas y descubre tu situación en 2 minutos. <strong>100% confidencial.</strong>
        </p>

        <div className="space-y-3 text-left mb-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">1</div>
            <span className="text-sm text-foreground">Responde Sí o No a 8 preguntas</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">2</div>
            <span className="text-sm text-foreground">Recibe tu diagnóstico de riesgo</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">3</div>
            <span className="text-sm text-foreground">Un abogado revisará tu caso gratis</span>
          </div>
        </div>

        <Button
          onClick={handleStartQuiz}
          className="w-full h-12 sm:h-14 text-sm sm:text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
        >
          Comenzar Evaluación
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <p className="text-[10px] text-center text-muted-foreground mt-4">
          No pedimos datos personales hasta el final. Tu privacidad es nuestra prioridad.
        </p>
      </div>
    );
  }

  // Questions Step
  if (step === 'questions') {
    const question = QUIZ_QUESTIONS[currentQuestion];
    const currentAnswer = answers[question.id];
    const hasAnswered = currentAnswer !== undefined;
    
    return (
      <div>
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>{question.category}</span>
            <span>{currentQuestion + 1} de {QUIZ_QUESTIONS.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-6 leading-tight">
          {question.question}
        </h3>

        {/* Answer Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Button
            onClick={() => handleAnswer(true)}
            variant="outline"
            className={`h-14 text-base font-semibold border-2 transition-all ${
              hasAnswered && currentAnswer === true
                ? 'bg-destructive/10 border-destructive text-destructive'
                : 'hover:bg-destructive/10 hover:border-destructive hover:text-destructive'
            }`}
          >
            <Check className="mr-2 h-5 w-5" />
            Sí
          </Button>
          <Button
            onClick={() => handleAnswer(false)}
            variant="outline"
            className={`h-14 text-base font-semibold border-2 transition-all ${
              hasAnswered && currentAnswer === false
                ? 'bg-primary/10 border-primary text-primary'
                : 'hover:bg-primary/10 hover:border-primary hover:text-primary'
            }`}
          >
            <X className="mr-2 h-5 w-5" />
            No
          </Button>
        </div>

        {/* Back Button */}
        {currentQuestion > 0 && (
          <Button
            onClick={handleBack}
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Pregunta anterior
          </Button>
        )}
      </div>
    );
  }

  // Result Step
  if (step === 'result') {
    const risk = getRiskLevel();
    const RiskIcon = risk.icon;
    const yesCount = Object.values(answers).filter(Boolean).length;

    return (
      <div className="text-center">
        {/* Risk Icon */}
        <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4 ${
          risk.level === 'critical' ? 'bg-red-100' :
          risk.level === 'warning' ? 'bg-yellow-100' : 'bg-green-100'
        }`}>
          <RiskIcon className={`h-8 w-8 sm:h-10 sm:w-10 ${
            risk.level === 'critical' ? 'text-red-600' :
            risk.level === 'warning' ? 'text-yellow-600' : 'text-green-600'
          }`} />
        </div>

        {/* Result */}
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
          risk.level === 'critical' ? 'bg-red-100 text-red-700' :
          risk.level === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
        }`}>
          {risk.title}
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
          {risk.subtitle}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4">
          Respondiste <strong className="text-foreground">SÍ</strong> a {yesCount} de {QUIZ_QUESTIONS.length} indicadores de riesgo.
        </p>

        <p className="text-sm text-muted-foreground mb-6">
          {risk.description}
        </p>

        {/* CTA */}
        <div className={`p-4 rounded-lg mb-6 ${
          risk.level === 'critical' ? 'bg-red-50 border border-red-200' :
          risk.level === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'
        }`}>
          <p className={`text-sm font-semibold ${
            risk.level === 'critical' ? 'text-red-700' :
            risk.level === 'warning' ? 'text-yellow-700' : 'text-green-700'
          }`}>
            {risk.action}
          </p>
        </div>

        <Button
          onClick={() => setStep('contact')}
          className="w-full h-12 sm:h-14 text-sm sm:text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
        >
          Quiero una Evaluación Gratuita
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    );
  }

  // Contact Info Step (at the end)
  if (step === 'contact') {
    const risk = getRiskLevel();
    
    return (
      <div>
        <div className="text-center mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
            Último paso para tu evaluación
          </h3>
          <p className="text-sm text-muted-foreground">
            Un abogado especialista revisará tu caso y te contactará.
          </p>
        </div>

        <form onSubmit={contactForm.handleSubmit(onSubmitContact)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-foreground font-medium text-sm">
              Tu nombre completo *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Juan Pérez"
              {...contactForm.register('name')}
              className="h-11 text-sm border border-border bg-background text-foreground placeholder:text-muted-foreground"
            />
            {contactForm.formState.errors.name && (
              <p className="text-destructive text-xs">{contactForm.formState.errors.name.message}</p>
            )}
          </div>

          {/* Email */}
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

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-foreground font-medium text-sm">
              Teléfono de contacto *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+56 9 1234 5678"
              {...contactForm.register('phone')}
              className="h-11 text-sm border border-border bg-background text-foreground placeholder:text-muted-foreground"
            />
            {contactForm.formState.errors.phone && (
              <p className="text-destructive text-xs">{contactForm.formState.errors.phone.message}</p>
            )}
          </div>

          {/* Debt Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="debtAmount" className="text-foreground font-medium text-sm">
              Monto aproximado de tu deuda *
            </Label>
            <Select onValueChange={(value) => contactForm.setValue('debtAmount', value)}>
              <SelectTrigger className="h-11 text-sm border border-border bg-background text-foreground">
                <SelectValue placeholder="Selecciona un rango" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="menos-5m" className="text-foreground">Menos de $5.000.000</SelectItem>
                <SelectItem value="5m-20m" className="text-foreground">Entre $5M y $20.000.000</SelectItem>
                <SelectItem value="mas-20m" className="text-foreground">Más de $20.000.000</SelectItem>
              </SelectContent>
            </Select>
            {contactForm.formState.errors.debtAmount && (
              <p className="text-destructive text-xs">{contactForm.formState.errors.debtAmount.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              'Solicitar Evaluación Gratuita'
            )}
          </Button>

          <p className="text-[10px] text-center text-muted-foreground">
            Al enviar, aceptas nuestra política de protección de datos.
          </p>
        </form>
      </div>
    );
  }

  // Success Step
  if (step === 'success') {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        
        <h3 className="text-xl font-bold text-foreground mb-2">
          ¡Solicitud Enviada!
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4">
          Un abogado especialista revisará tu evaluación y te contactará en las próximas 24 horas.
        </p>

        <div className="p-4 rounded-lg bg-muted border border-border">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">¿Urgencia?</strong> Llámanos al <a href="tel:+56950098785" className="text-primary font-semibold">+56 9 5009 8785</a>
          </p>
        </div>
      </div>
    );
  }

  return null;
};
