import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDashboard } from "@/lib/dashboardState";
import { Share2, Instagram, Linkedin, Youtube } from "lucide-react";

function formatCount(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

const platformIcons: Record<string, React.ElementType> = {
  Instagram: Instagram,
  LinkedIn: Linkedin,
  YouTube: Youtube,
};

export default function SocialPulse() {
  const state = getDashboard();
  const { followers, recentPosts, angles } = state.socialPulse;

  return (
    <div className="space-y-6 max-w-5xl">
      <h2 className="text-xl font-heading font-bold">Social Pulse</h2>

      {/* Follower Counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(followers).map(([platform, count]) => (
          <Card key={platform} className="bg-card/80 border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{platform}</p>
              <p className="text-xl font-heading font-bold text-foreground">{formatCount(count)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Posts */}
      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <Share2 className="h-4 w-4 text-primary" /> Recent Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentPosts.map((post, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] border-border/50">{post.platform}</Badge>
                <span className="text-sm text-foreground">{post.text}</span>
              </div>
              <span className="text-xs text-primary font-mono">{post.engagement}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Content Angles */}
      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading text-muted-foreground">Next Angles to Create</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {angles.map((angle, i) => (
              <Badge key={i} className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 cursor-pointer text-xs">
                {angle}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
