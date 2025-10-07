import { parse } from 'csv-parse/sync'

export interface PersonData {
  name: string
  netWorth: number
  rank: number
  company: string
  country: string
  [key: string]: string | number
}

// Convert header to camelCase
function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, (chr) => chr.toLowerCase())
}

// Parse numeric values
function parseNumeric(value: string): number {
  if (!value || value === '') return 0
  
  // Remove currency symbols, commas, and other non-numeric characters except decimal point
  const cleaned = value.replace(/[^\d.-]/g, '')
  const parsed = parseFloat(cleaned)
  
  return isNaN(parsed) ? 0 : parsed
}

export async function fetchCsvData(): Promise<PersonData[]> {
  const csvUrl = process.env.NEXT_PUBLIC_CSV_URL || 
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSYQFf5uPRx3VOAoT2irE6Kw8LjXQse_QHHKMcyiy6qiwK07q_1JFwlNcAhkWShAoL74NurBBrQbhHR/pub?gid=8699197&single=true&output=csv'

  try {
    const response = await fetch(csvUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`)
    }

    const csvText = await response.text()
    
    // Parse CSV with headers
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    })

    // Transform data to camelCase headers and proper types
    const transformedData: PersonData[] = records.map((record: any, index: number) => {
      const transformed: any = {}
      
      // Convert all headers to camelCase
      Object.keys(record).forEach(key => {
        const camelKey = toCamelCase(key)
        transformed[camelKey] = record[key]
      })

      // Ensure required fields with defaults
      return {
        name: transformed.name || transformed.fullName || `Person ${index + 1}`,
        netWorth: parseNumeric(transformed.netWorth || transformed.networth || transformed.wealth || '0'),
        rank: parseNumeric(transformed.rank || transformed.position || String(index + 1)),
        company: transformed.company || transformed.organization || '—',
        country: transformed.country || transformed.nation || '—',
        ...transformed
      }
    })

    // Sort by net worth descending
    transformedData.sort((a, b) => b.netWorth - a.netWorth)

    // Update ranks based on sorted order
    transformedData.forEach((person, index) => {
      person.rank = index + 1
    })

    return transformedData

  } catch (error) {
    console.error('Error fetching CSV data:', error)
    
    // Return sample data if CSV fetch fails
    return [
      {
        name: 'Sample Person 1',
        netWorth: 150000,
        rank: 1,
        company: 'Sample Corp',
        country: 'USA'
      },
      {
        name: 'Sample Person 2',
        netWorth: 250000,
        rank: 2,
        company: 'Example Inc',
        country: 'Canada'
      }
    ]
  }
}

