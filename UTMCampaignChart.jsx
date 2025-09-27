import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from '../../lib/supabase'

export function UTMCampaignChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUTMCampaignData()
  }, [])

  const loadUTMCampaignData = async () => {
    try {
      setLoading(true)
      
      // Buscar dados dos últimos 12 meses
      const twelveMonthsAgo = new Date()
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
      
      const { data: matriculas, error } = await supabase
        .from('matriculas')
        .select('valor, utm_campaign')
        .gte('data_compra', twelveMonthsAgo.toISOString().split('T')[0])

      if (error) {
        console.error('Erro ao buscar dados UTM Campaign:', error)
        return
      }

      // Agrupar por UTM Campaign
      const campaignRevenue = {}
      
      matriculas?.forEach(matricula => {
        const campaign = matricula.utm_campaign || 'Sem campanha'
        const value = parseFloat(matricula.valor) || 0
        
        if (!campaignRevenue[campaign]) {
          campaignRevenue[campaign] = {
            campaign: campaign.length > 20 ? campaign.substring(0, 20) + '...' : campaign,
            fullCampaign: campaign,
            receita: 0,
            vendas: 0
          }
        }
        
        campaignRevenue[campaign].receita += value
        campaignRevenue[campaign].vendas += 1
      })

      // Converter para array e ordenar por receita
      const chartData = Object.values(campaignRevenue)
        .sort((a, b) => b.receita - a.receita)
        .slice(0, 10) // Top 10 campanhas

      setData(chartData)
    } catch (error) {
      console.error('Erro ao carregar dados UTM Campaign:', error)
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-medium text-gray-900 break-words">{data.fullCampaign}</p>
          <p className="text-green-600 font-semibold">
            Receita: {formatCurrency(data.receita)}
          </p>
          <p className="text-gray-600">
            Vendas: {data.vendas}
          </p>
          <p className="text-gray-500 text-sm">
            Ticket médio: {formatCurrency(data.receita / data.vendas)}
          </p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <p>Nenhum dado de campanha encontrado</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="campaign" 
          tick={{ fontSize: 10 }}
          className="text-gray-600"
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          className="text-gray-600"
          tickFormatter={formatCurrency}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="receita" 
          fill="#16a34a"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

