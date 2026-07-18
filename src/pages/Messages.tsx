import { useEffect, useState } from "react";
import { Star, Trash2, Archive, Reply, Search, MessageSquare, Mail } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMessages, useMarkMessageRead, useToggleStar, useDeleteMessage } from "@/hooks/useMessages";
import { initials, timeAgo, cn } from "@/lib/utils";
import type { Message } from "@/types";

const LABEL_COLOR: Record<string, string> = {
  Support: "bg-primary/10 text-primary",
  Sales: "bg-success/10 text-success",
  General: "bg-secondary text-secondary-foreground",
  Urgent: "bg-destructive/10 text-destructive",
};

export default function Messages() {
  const { data: messages = [], isLoading, isError, refetch } = useMessages();
  const markRead = useMarkMessageRead();
  const toggleStar = useToggleStar();
  const deleteMessage = useDeleteMessage();

  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  const filtered = messages.filter((m) => {
    if (filter === "unread" && m.read) return false;
    if (filter === "starred" && !m.starred) return false;
    if (search && !`${m.sender} ${m.subject}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  useEffect(() => {
    if (!selectedId && filtered.length > 0) setSelectedId(filtered[0].id);
  }, [filtered, selectedId]);

  const selected = messages.find((m) => m.id === selectedId) ?? null;

  function selectMessage(msg: Message) {
    setSelectedId(msg.id);
    if (!msg.read) markRead.mutate({ id: msg.id, read: true });
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" description={`${unreadCount} unread conversations`} />

      {isError ? (
        <Card>
          <ErrorState onRetry={() => refetch()} />
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="grid grid-cols-1 md:grid-cols-[360px_1fr]">
            {/* List */}
            <div className="flex flex-col border-b border-border md:border-b-0 md:border-r">
              <div className="space-y-3 border-b border-border p-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages..." className="pl-9" />
                </div>
                <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
                  <TabsList className="w-full">
                    <TabsTrigger value="all" className="flex-1">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="flex-1">
                      Unread
                    </TabsTrigger>
                    <TabsTrigger value="starred" className="flex-1">
                      Starred
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="max-h-[560px] overflow-y-auto">
                {isLoading ? (
                  <div className="space-y-4 p-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-1.5">
                          <Skeleton className="h-3 w-2/3" />
                          <Skeleton className="h-2.5 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <EmptyState icon={Mail} title="No messages" description="Nothing matches your current filter." />
                ) : (
                  filtered.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => selectMessage(msg)}
                      className={cn(
                        "flex w-full items-start gap-3 border-b border-border/60 px-4 py-3.5 text-left transition-colors hover:bg-muted/50",
                        selectedId === msg.id && "bg-accent",
                        !msg.read && "bg-primary/[0.03]"
                      )}
                    >
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={msg.avatar} alt={msg.sender} />
                        <AvatarFallback>{initials(msg.sender)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={cn("truncate text-sm", !msg.read ? "font-semibold" : "font-medium")}>{msg.sender}</p>
                          <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(msg.date)}</span>
                        </div>
                        <p className="truncate text-xs font-medium">{msg.subject}</p>
                        <p className="truncate text-xs text-muted-foreground">{msg.preview}</p>
                      </div>
                      {!msg.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Detail */}
            <div className="flex flex-col">
              {selected ? (
                <>
                  <div className="flex items-start justify-between gap-3 border-b border-border p-5">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-11 w-11">
                        <AvatarImage src={selected.avatar} alt={selected.sender} />
                        <AvatarFallback>{initials(selected.sender)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-display text-base font-semibold">{selected.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {selected.sender} &middot; {timeAgo(selected.date)}
                        </p>
                        <Badge className={cn("mt-1.5", LABEL_COLOR[selected.label])}>{selected.label}</Badge>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => toggleStar.mutate(selected.id)}>
                        <Star className={cn("h-4 w-4", selected.starred && "fill-warning text-warning")} />
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          deleteMessage.mutate(selected.id);
                          setSelectedId(null);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 p-5">
                    <p className="text-sm leading-relaxed text-foreground/90">{selected.body}</p>
                  </div>
                  <div className="border-t border-border p-4">
                    <Textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder={`Reply to ${selected.sender}...`}
                      className="min-h-[80px]"
                    />
                    <div className="mt-2 flex justify-end">
                      <Button
                        size="sm"
                        disabled={!reply.trim()}
                        onClick={() => setReply("")}
                      >
                        <Reply className="h-4 w-4" /> Send Reply
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <EmptyState icon={MessageSquare} title="Select a message" description="Choose a conversation from the list to read it." />
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
