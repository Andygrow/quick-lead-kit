import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, CheckCircle, XCircle, User, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProfilePreview {
  fullName: string;
  headline: string | null;
  profilePicture: string | null;
  location: string | null;
  connections: number | null;
  url: string;
}

interface ProfileConfirmationProps {
  profile: ProfilePreview;
  onConfirm: () => void;
  onReject: () => void;
  isLoading?: boolean;
}

export const ProfileConfirmation = ({
  profile,
  onConfirm,
  onReject,
  isLoading = false,
}: ProfileConfirmationProps) => {
  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Badge variant="outline" className="text-xs font-medium">
            Confirmar Perfil
          </Badge>
          <h3 className="text-lg font-semibold text-foreground">
            ¿Es este el perfil correcto?
          </h3>
          <p className="text-sm text-muted-foreground">
            Verifica que sea la persona que deseas analizar antes de continuar
          </p>
        </div>

        {/* Profile Card */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <Avatar className="w-20 h-20 border-2 border-primary/20">
              {profile.profilePicture ? (
                <AvatarImage src={profile.profilePicture} alt={profile.fullName} />
              ) : null}
              <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <h4 className="text-xl font-bold text-foreground truncate">
                  {profile.fullName}
                </h4>
                {profile.headline && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {profile.headline}
                  </p>
                )}
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {profile.location}
                  </span>
                )}
                {profile.connections && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {profile.connections.toLocaleString()} conexiones
                  </span>
                )}
              </div>

              {/* LinkedIn Link */}
              <a
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                Ver en LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onReject}
            disabled={isLoading}
            className="flex-1 gap-2"
          >
            <XCircle className="w-4 h-4" />
            No, buscar otro
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "flex-1 gap-2",
              "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            )}
          >
            <CheckCircle className="w-4 h-4" />
            {isLoading ? "Analizando..." : "Sí, analizar perfil"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
