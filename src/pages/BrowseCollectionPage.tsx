import { useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { CarrierCard } from '@/components/carrier/CarrierCard';
import { useCarriers } from '@/hooks/useCarriers';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Filter, X, Search, ArrowUpDown } from 'lucide-react';
import { CATEGORIES } from '@/lib/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const BrowseCollectionPage = () => {
  const { data: carriers, isLoading } = useCarriers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<string[]>([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  // Extract unique values for filters
  const filterOptions = useMemo(() => {
    if (!carriers) return { brands: [], ageRanges: [] };
    
    const brands = [...new Set(carriers.map(c => c.brand_name))].sort();
    const ageRanges = [...new Set(carriers.map(c => c.age_range))].sort();
    
    return { brands, ageRanges };
  }, [carriers]);

  // Filter carriers
  const filteredCarriers = useMemo(() => {
    if (!carriers) return [];
    
    const filtered = carriers.filter((carrier) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          carrier.brand_name.toLowerCase().includes(query) ||
          carrier.model_name.toLowerCase().includes(query) ||
          carrier.description?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(carrier.category)) {
        return false;
      }
      
      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(carrier.brand_name)) {
        return false;
      }
      
      // Age range filter
      if (selectedAgeRanges.length > 0 && !selectedAgeRanges.includes(carrier.age_range)) {
        return false;
      }
      
      // Availability filter
      if (showAvailableOnly && carrier.availability_status !== 'available') {
        return false;
      }
      
      return true;
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sortBy === 'price-asc') return a.weekly_rent - b.weekly_rent;
      if (sortBy === 'price-desc') return b.weekly_rent - a.weekly_rent;
      // newest
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return sorted;
  }, [carriers, searchQuery, selectedCategories, selectedBrands, selectedAgeRanges, showAvailableOnly, sortBy]);

  const toggleFilter = (value: string, selected: string[], setSelected: (val: string[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedAgeRanges([]);
    setShowAvailableOnly(false);
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedAgeRanges.length > 0 ||
    showAvailableOnly;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Availability */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Availability</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="available-only"
            checked={showAvailableOnly}
            onCheckedChange={(checked) => setShowAvailableOnly(checked === true)}
          />
          <label htmlFor="available-only" className="text-sm cursor-pointer">
            Show available only
          </label>
        </div>
      </div>

      {/* Categories */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Category</Label>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <div key={category.slug} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.slug}`}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => toggleFilter(category.slug, selectedCategories, setSelectedCategories)}
              />
              <label htmlFor={`category-${category.slug}`} className="text-sm cursor-pointer">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      {filterOptions.brands.length > 0 && (
        <div>
          <Label className="text-sm font-medium mb-3 block">Brand</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filterOptions.brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => toggleFilter(brand, selectedBrands, setSelectedBrands)}
                />
                <label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Age Ranges */}
      {filterOptions.ageRanges.length > 0 && (
        <div>
          <Label className="text-sm font-medium mb-3 block">Age Range</Label>
          <div className="space-y-2">
            {filterOptions.ageRanges.map((ageRange) => (
              <div key={ageRange} className="flex items-center space-x-2">
                <Checkbox
                  id={`age-${ageRange}`}
                  checked={selectedAgeRanges.includes(ageRange)}
                  onCheckedChange={() => toggleFilter(ageRange, selectedAgeRanges, setSelectedAgeRanges)}
                />
                <label htmlFor={`age-${ageRange}`} className="text-sm cursor-pointer">
                  {ageRange}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearAllFilters} className="w-full">
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <Layout>
      <HeroSection />

      <section className="bg-background">
        <div className="container py-10 md:py-14">
          <div className="mb-8">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Browse All Carriers
            </h2>
            <p className="text-muted-foreground">
              Use filters to quickly find the right carrier for your family.
            </p>
          </div>

          {/* Sticky bar (search/sort/filters) */}
          <div className="sticky top-[72px] z-20 -mx-4 px-4 py-4 bg-background/90 backdrop-blur border-b border-border mb-8">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by brand, model, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card"
                />
              </div>

              <div className="flex gap-3 items-center">
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="hidden md:inline">Sort</span>
                </div>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                  <SelectTrigger className="w-[200px] bg-card">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-asc">Weekly price: Low to high</SelectItem>
                    <SelectItem value="price-desc">Weekly price: High to low</SelectItem>
                  </SelectContent>
                </Select>

                {/* Mobile Filter Button */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden gap-2 bg-card">
                      <Filter className="w-4 h-4" />
                      Filters
                      {hasActiveFilters && (
                        <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          !
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Active filter chips */}
            {(hasActiveFilters || sortBy !== 'newest') && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: “{searchQuery}”
                    <button
                      className="ml-1 rounded hover:text-foreground"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedCategories.map((c) => (
                  <Badge key={`cat-${c}`} variant="secondary" className="gap-1">
                    {CATEGORIES.find((x) => x.slug === c)?.name ?? c}
                    <button
                      className="ml-1 rounded hover:text-foreground"
                      onClick={() => setSelectedCategories(selectedCategories.filter((x) => x !== c))}
                      aria-label={`Remove category ${c}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {selectedBrands.map((b) => (
                  <Badge key={`brand-${b}`} variant="secondary" className="gap-1">
                    {b}
                    <button
                      className="ml-1 rounded hover:text-foreground"
                      onClick={() => setSelectedBrands(selectedBrands.filter((x) => x !== b))}
                      aria-label={`Remove brand ${b}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {selectedAgeRanges.map((a) => (
                  <Badge key={`age-${a}`} variant="secondary" className="gap-1">
                    {a}
                    <button
                      className="ml-1 rounded hover:text-foreground"
                      onClick={() => setSelectedAgeRanges(selectedAgeRanges.filter((x) => x !== a))}
                      aria-label={`Remove age range ${a}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {showAvailableOnly && (
                  <Badge variant="secondary" className="gap-1">
                    Available only
                    <button
                      className="ml-1 rounded hover:text-foreground"
                      onClick={() => setShowAvailableOnly(false)}
                      aria-label="Remove availability filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                <Separator orientation="vertical" className="h-5 mx-1" />
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="gap-2">
                  <X className="w-4 h-4" />
                  Reset
                </Button>
              </div>
            )}
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-[132px] bg-card rounded-xl border p-5 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Filters</h3>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      Clear
                    </Button>
                  )}
                </div>
                <FilterContent />
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1">
              <div className="mb-4 text-sm text-muted-foreground">
                {isLoading ? (
                  'Loading...'
                ) : (
                  `${filteredCarriers.length} carrier${filteredCarriers.length !== 1 ? 's' : ''} found`
                )}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="aspect-[4/3] rounded-lg" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              ) : filteredCarriers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCarriers.map((carrier, index) => (
                    <div
                      key={carrier.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <CarrierCard carrier={carrier} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-card border rounded-xl">
                  <p className="text-muted-foreground mb-4">
                    No carriers found matching your criteria.
                  </p>
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearAllFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <HowItWorksSection />
    </Layout>
  );
};

export default BrowseCollectionPage;
