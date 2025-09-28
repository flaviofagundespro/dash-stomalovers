import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from './supabase.js'

export function UTMSourceChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUTMSourceData()
  }, [])

  const loadUTMSourceData = async () => {
    try {
      setLoading(true)
      
      // Buscar dados dos últimos 12 meses
      const twelveMonthsAgo = new Date()
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
      
      const { data: matriculas, error } = await supabase
        .from('matriculas')
        .select('valor_pago, utm_source')
        .gte('data_compra', twelveMonthsAgo.toISOString().split('T')[0])

      if (error) {
        console.error('Erro ao buscar dados UTM Source:', error)
        return
      }

      // Agrupar por UTM Source
      const sourceRevenue = {}
      
      matriculas?.forEach(matricula => {
        const source = matricula.utm_source || 'Direto/Não identificado'
        const value = parseFloat(matricula.valor_pago) || 0
        
        if (!sourceRevenue[source]) {
          sourceRevenue[source] = {
            source: source,
            receita: 0,
            vendas: 0
          }
        }
        
        sourceRevenue[source].receita += value
        sourceRevenue[source].vendas += 1
      })

      // Converter para array e ordenar por receita
      const chartData = Object.values(sourceRevenue)
        .sort((a, b) => b.receita - a.receita)
        .slice(0, 8) // Top 8 canais

      setData(chartData)
    } catch (error) {
      console.error('Erro ao carregar dados UTM Source:', error)
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
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600 font-semibold">
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <p>Nenhum dado de canal encontrado</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="source" 
          tick={{ fontSize: 11 }}
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
          fill="#2563eb"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

