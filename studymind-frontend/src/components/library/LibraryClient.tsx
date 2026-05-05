'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  LayoutGrid, 
  Plus,
  ArrowUpAz,
  Calendar,
  Layers,
  History,
  TrendingUp,
  Inbox,
  BookOpen
} from 'lucide-react';
import { Button, Input, Card, Badge, Skeleton, PaperCardSkeleton } from '@/components/ui';
import { LibraryPaperCard } from './LibraryPaperCard';
import { PreviewModal } from './PreviewModal';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import { SUBJECTS, YEARS } from '@/constants';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export function LibraryClient({ initialPapers, totalCount }: { initialPapers: any[], totalCount: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [papers, setPapers] = useState(initialPapers);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [count, setCount] = useState(totalCount);
  const [page, setPage] = useState(1);
  
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    subject: searchParams.get('subject') || 'All Subjects',
    year: searchParams.get('year') || 'All Years',
    sort: searchParams.get('sort') || 'newest',
    tab: searchParams.get('tab') || 'all',
  });

  const [previewPaper, setPreviewPaper] = useState<any>(null);

  // Fetching logic
  const fetchPapers = useCallback(async (isLoadMore = false) => {
    const currentBatch = isLoadMore ? page + 1 : 1;
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      let query = supabase
        .from('papers')
        .select('*, profiles(university)', { count: 'exact' });

      // Filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,subject.ilike.%${filters.search}%`);
      }
      if (filters.subject !== 'All Subjects') {
        query = query.eq('subject', filters.subject);
      }
      if (filters.year !== 'All Years') {
        query = query.eq('exam_year', parseInt(filters.year));
      }
      if (filters.tab === 'my') {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) query = query.eq('user_id', user.id);
      } else {
        query = query.eq('is_public', true);
      }

      // Sort
      if (filters.sort === 'newest') query = query.order('created_at', { ascending: false });
      if (filters.sort === 'oldest') query = query.order('created_at', { ascending: true });
      if (filters.sort === 'views') query = query.order('view_count', { ascending: false });

      // Pagination
      const from = (currentBatch - 1) * 12;
      const to = from + 11;
      query = query.range(from, to);

      const { data, count: total, error } = await query;

      if (error) throw error;

      if (isLoadMore) {
        setPapers(prev => [...prev, ...data]);
        setPage(currentBatch);
      } else {
        setPapers(data);
        setCount(total || 0);
        setPage(1);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters, page]);

  // Sync state to URL and fetch
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('q', filters.search);
    if (filters.subject !== 'All Subjects') params.set('subject', filters.subject);
    if (filters.year !== 'All Years') params.set('year', filters.year);
    if (filters.sort !== 'newest') params.set('sort', filters.sort);
    if (filters.tab !== 'all') params.set('tab', filters.tab);
    
    router.replace(`/library?${params.toString()}`, { scroll: false });
    fetchPapers();
  }, [filters, router]);

  const clearFilters = () => {
    setFilters({
      search: '',
      subject: 'All Subjects',
      year: 'All Years',
      sort: 'newest',
      tab: 'all',
    });
  };

  const hasActiveFilters = filters.search || filters.subject !== 'All Subjects' || filters.year !== 'All Years';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-heading font-black tracking-tight">Paper Library</h1>
            <Badge size="md" className="bg-primary/10 text-primary border-primary/20">{count} Papers</Badge>
          </div>
          <p className="text-muted text-sm font-medium">Browse and search past exam papers from all departments</p>
        </div>
        <Link href="/upload">
          <Button className="h-11 px-6 rounded-xl group shadow-glow">
            Upload Paper <Plus className="w-5 h-5 ml-2 group-hover:rotate-90 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-16 z-20 pt-2 pb-4 bg-background/80 backdrop-blur-md">
        <Card padding="sm" className="space-y-4">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <div className="relative w-full lg:max-w-[400px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                placeholder="Search title, subject, or tags..."
                className="w-full h-10 bg-surface-2 border border-border-accent rounded-xl pl-10 pr-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <FilterSelect 
                value={filters.subject} 
                onChange={(v: string) => setFilters(prev => ({ ...prev, subject: v }))}
                options={['All Subjects', ...SUBJECTS]}
                icon={BookOpen}
              />
              <FilterSelect 
                value={filters.year} 
                onChange={(v: string) => setFilters(prev => ({ ...prev, year: v }))}
                options={['All Years', ...YEARS.map(String)]}
                icon={Calendar}
              />
              <FilterSelect 
                value={filters.sort} 
                onChange={(v: string) => setFilters(prev => ({ ...prev, sort: v }))}
                options={[
                  { label: 'Newest', value: 'newest' },
                  { label: 'Oldest', value: 'oldest' },
                  { label: 'Most Viewed', value: 'views' }
                ]}
                icon={TrendingUp}
              />
            </div>
            
            <div className="flex bg-surface-2 p-1 rounded-xl border border-border-accent ml-auto">
              <TabButton active={filters.tab === 'all'} onClick={() => setFilters(prev => ({ ...prev, tab: 'all' }))} label="All Papers" />
              <TabButton active={filters.tab === 'my'} onClick={() => setFilters(prev => ({ ...prev, tab: 'my' }))} label="My Papers" />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center flex-wrap gap-2 pt-2 border-t border-border-accent/30">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest mr-2">Active:</span>
              {filters.search && (
                <FilterPill label={`"${filters.search}"`} onRemove={() => setFilters(prev => ({ ...prev, search: '' }))} />
              )}
              {filters.subject !== 'All Subjects' && (
                <FilterPill label={filters.subject} onRemove={() => setFilters(prev => ({ ...prev, subject: 'All Subjects' }))} />
              )}
              {filters.year !== 'All Years' && (
                <FilterPill label={filters.year} onRemove={() => setFilters(prev => ({ ...prev, year: 'All Years' }))} />
              )}
              <button onClick={clearFilters} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest ml-auto">
                Clear all filters
              </button>
            </div>
          )}
        </Card>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <PaperCardSkeleton key={i} />)}
        </div>
      ) : papers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper) => (
              <LibraryPaperCard 
                key={paper.id} 
                paper={paper} 
                onPreview={(p) => setPreviewPaper(p)}
              />
            ))}
          </div>

          {/* Load More */}
          {papers.length < count && (
            <div className="flex flex-col items-center gap-4 pt-12">
              <p className="text-xs text-muted font-medium">Showing {papers.length} of {count} papers</p>
              <Button 
                variant="secondary" 
                onClick={() => fetchPapers(true)} 
                loading={loadingMore}
                className="px-12"
              >
                Load 12 More
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="py-24 text-center glass rounded-[32px] border-dashed space-y-6">
          <div className="w-20 h-20 bg-surface-2 rounded-3xl flex items-center justify-center mx-auto text-muted">
            <Inbox className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-heading font-bold">No papers found</h3>
            <p className="text-muted text-sm max-w-xs mx-auto">
              {filters.tab === 'my' 
                ? "You haven't uploaded any papers yet. Upload one to see it here!" 
                : "Try adjusting your filters or search terms to find what you're looking for."}
            </p>
          </div>
          {filters.tab === 'my' ? (
            <Link href="/upload">
              <Button size="lg" className="px-10">Upload Your First Paper</Button>
            </Link>
          ) : (
            <Button variant="secondary" onClick={clearFilters}>Clear All Filters</Button>
          )}
        </div>
      )}

      {/* Preview Modal */}
      <PreviewModal 
        isOpen={!!previewPaper} 
        onClose={() => setPreviewPaper(null)} 
        paper={previewPaper} 
      />
    </div>
  );
}

// --- Internal Helpers ---

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | { label: string; value: string })[];
  icon: any;
}

function FilterSelect({ value, onChange, options, icon: Icon }: FilterSelectProps) {
  return (
    <div className="relative group">
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none h-10 bg-surface-2 border border-border-accent rounded-xl pl-10 pr-10 text-xs font-bold uppercase tracking-wider outline-none hover:border-primary/50 transition-all cursor-pointer"
      >
        {options.map((opt) => (
          <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none group-hover:text-primary transition-colors" />
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

function TabButton({ active, onClick, label }: TabButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
        active ? "bg-background text-foreground shadow-sm" : "text-muted hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
      {label}
      <button onClick={onRemove} className="hover:text-foreground transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
