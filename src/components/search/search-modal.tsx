'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Suggestion {
  term: string;
  type: 'recent' | 'trending' | 'suggestion';
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('recentSearches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions.map((s: string) => ({ term: s, type: 'suggestion' as const })));
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    // Save to recent searches
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    
    router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-4 top-20 z-50 mx-auto max-w-2xl animate-in slide-in-from-top-4 duration-300">
        <div className="bg-card rounded-xl border border-border shadow-2xl overflow-hidden">
          {/* Search Input */}
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for herbal products, supplements, teas..."
              className="w-full h-14 pl-12 pr-12 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-lg"
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </form>
          
          <div className="border-t border-border max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : query ? (
              suggestions.length > 0 ? (
                <ul className="py-2">
                  {suggestions.map((item, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleSearch(item.term)}
                        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-muted transition-colors"
                      >
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{item.term}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No suggestions found
                </div>
              )
            ) : (
              <div className="py-2">
                {recentSearches.length > 0 && (
                  <>
                    <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">Recent Searches</p>
                    <ul>
                      {recentSearches.map((term, index) => (
                        <li key={index}>
                          <button
                            onClick={() => handleSearch(term)}
                            className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-muted transition-colors"
                          >
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{term}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase mt-2">Trending</p>
                <ul>
                  {['Herbal Tea', 'Moringa', 'Turmeric', 'Ginger Supplements'].map((term, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleSearch(term)}
                        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-muted transition-colors"
                      >
                        <TrendingUp className="h-4 w-4 text-accent" />
                        <span className="text-foreground">{term}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Keyboard hint */}
          <div className="border-t border-border px-4 py-2 bg-muted/50">
            <p className="text-xs text-muted-foreground">
              Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-foreground font-mono">Enter</kbd> to search
              or <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-foreground font-mono">Esc</kbd> to close
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

