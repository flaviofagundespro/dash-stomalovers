import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from './supabase.js'

export function RevenueChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRevenueData()
  }, [])

  const loadRevenueData = async () => {
    try {
      setLoading(true)
      
      // Buscar dados dos últimos 6 meses
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      
      const { data: matriculas, error } = await supabase
        .from('matriculas')
        .select('valor_pago, data_compra')
        .gte('data_compra', sixMonthsAgo.toISOString().split('T')[0])
        .order('data_compra', { ascending: true })

      if (error) {
        console.error('Erro ao buscar dados de receita:', error)
        return
      }

      // Agrupar por mês
      const monthlyRevenue = {}
      
      matriculas?.forEach(matricula => {
        const date = new Date(matricula.data_compra)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const monthName = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
        
        if (!monthlyRevenue[monthKey]) {
          monthlyRevenue[monthKey] = {
            month: monthName,
            receita: 0
          }
        }
        
        monthlyRevenue[monthKey].receita += parseFloat(matricula.valor_pago) || 0
      })

      // Converter para array e ordenar
      const chartData = Object.values(monthlyRevenue).sort((a, b) => {
        return new Date(a.month) - new Date(b.month)
      })

      setData(chartData)
    } catch (error) {
      console.error('Erro ao carregar dados de receita:', error)
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
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <p>Nenhum dado de receita encontrado</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }}
          className="text-gray-600"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          className="text-gray-600"
          tickFormatter={formatCurrency}
        />
        <Tooltip 
          formatter={(value) => [formatCurrency(value), 'Receita']}
          labelStyle={{ color: '#374151' }}
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="receita" 
          stroke="#2563eb" 
          strokeWidth={3}
          dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

