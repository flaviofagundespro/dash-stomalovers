import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx'
import { Badge } from './ui/badge.jsx'
import { Calendar, DollarSign } from 'lucide-react'

export function RecentSales() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecentSales()
  }, [])

  const loadRecentSales = async () => {
    try {
      setLoading(true)
      
      const { data: matriculas, error } = await supabase
        .from('matriculas')
        .select(`
          id,
          valor_pago,
          data_compra,
          plataforma_compra,
          Leads (
            nome,
            email
          ),
          cursos (
            nome
          )
        `)
        .order('data_compra', { ascending: false })
        .limit(5)

      if (error) {
        console.error('Erro ao buscar vendas recentes:', error)
        return
      }

      setSales(matriculas || [])
    } catch (error) {
      console.error('Erro ao carregar vendas recentes:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getPlatformColor = (platform) => {
    const colors = {
      'hotmart': 'bg-orange-100 text-orange-800',
      'greenn': 'bg-green-100 text-green-800',
      'asaas': 'bg-blue-100 text-blue-800',
      'woocommerce': 'bg-purple-100 text-purple-800'
    }
    return colors[platform?.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Últimas 5 Vendas</CardTitle>
          <CardDescription>Vendas mais recentes registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (sales.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Últimas 5 Vendas</CardTitle>
          <CardDescription>Vendas mais recentes registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-gray-500">
            <p>Nenhuma venda encontrada</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimas 5 Vendas</CardTitle>
        <CardDescription>Vendas mais recentes registradas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sales.map((sale, index) => (
            <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900">
                    {sale.Leads?.nome || 'Nome não disponível'}
                  </h4>
                  <Badge className={getPlatformColor(sale.plataforma_compra)}>
                    {sale.plataforma_compra || 'N/A'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {sale.cursos?.nome || 'Curso não identificado'}
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(sale.data_compra)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-3 h-3" />
                    <span className="font-semibold text-green-600">
                      {formatCurrency(sale.valor_pago)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

