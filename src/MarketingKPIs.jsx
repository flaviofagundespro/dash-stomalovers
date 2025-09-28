import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx'
import { Badge } from './ui/badge.jsx'
import { TrendingUp, Target, Users, Globe } from 'lucide-react'

export function MarketingKPIs() {
  const [stats, setStats] = useState({
    totalChannels: 0,
    totalCampaigns: 0,
    bestChannel: null,
    bestCampaign: null,
    conversionRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMarketingStats()
  }, [])

  const loadMarketingStats = async () => {
    try {
      setLoading(true)
      
      // Buscar dados dos últimos 12 meses
      const twelveMonthsAgo = new Date()
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
      
      const { data: matriculas, error } = await supabase
        .from('matriculas')
        .select('valor_pago, utm_source, utm_campaign')
        .gte('data_compra', twelveMonthsAgo.toISOString().split('T')[0])

      if (error) {
        console.error('Erro ao buscar dados de marketing:', error)
        return
      }

      // Buscar total de leads para calcular conversão
      const { data: leads, error: leadsError } = await supabase
        .from('Leads')
        .select('id')
        .gte('created_at', twelveMonthsAgo.toISOString().split('T')[0])

      if (leadsError) {
        console.error('Erro ao buscar leads:', leadsError)
      }

      // Analisar canais
      const channels = {}
      const campaigns = {}
      
      matriculas?.forEach(matricula => {
        const source = matricula.utm_source || 'Direto'
        const campaign = matricula.utm_campaign || 'Sem campanha'
        const value = parseFloat(matricula.valor_pago) || 0
        
        // Canais
        if (!channels[source]) {
          channels[source] = { receita: 0, vendas: 0 }
        }
        channels[source].receita += value
        channels[source].vendas += 1
        
        // Campanhas
        if (!campaigns[campaign]) {
          campaigns[campaign] = { receita: 0, vendas: 0 }
        }
        campaigns[campaign].receita += value
        campaigns[campaign].vendas += 1
      })

      // Encontrar melhor canal e campanha
      const bestChannel = Object.entries(channels)
        .sort(([,a], [,b]) => b.receita - a.receita)[0]
      
      const bestCampaign = Object.entries(campaigns)
        .sort(([,a], [,b]) => b.receita - a.receita)[0]

      // Calcular taxa de conversão
      const totalLeads = leads?.length || 0
      const totalSales = matriculas?.length || 0
      const conversionRate = totalLeads > 0 ? (totalSales / totalLeads) * 100 : 0

      setStats({
        totalChannels: Object.keys(channels).length,
        totalCampaigns: Object.keys(campaigns).length,
        bestChannel: bestChannel ? {
          name: bestChannel[0],
          receita: bestChannel[1].receita,
          vendas: bestChannel[1].vendas
        } : null,
        bestCampaign: bestCampaign ? {
          name: bestCampaign[0],
          receita: bestCampaign[1].receita,
          vendas: bestCampaign[1].vendas
        } : null,
        conversionRate
      })

    } catch (error) {
      console.error('Erro ao carregar estatísticas de marketing:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-16">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Canais Ativos</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalChannels}
          </div>
          <p className="text-xs text-muted-foreground">
            Fontes de tráfego identificadas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Campanhas</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.totalCampaigns}
          </div>
          <p className="text-xs text-muted-foreground">
            Campanhas com vendas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Melhor Canal</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {stats.bestChannel ? (
            <>
              <div className="text-lg font-bold text-purple-600 mb-1">
                {stats.bestChannel.name}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(stats.bestChannel.receita)} • {stats.bestChannel.vendas} vendas
              </p>
            </>
          ) : (
            <div className="text-sm text-gray-500">Sem dados</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {stats.conversionRate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Leads que se tornaram clientes
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

