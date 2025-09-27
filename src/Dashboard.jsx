import { useState, useEffect } from 'react'
import { logout } from './auth.js'
import { supabase } from './supabase.js'
import { Button } from './ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs.jsx'
import { Badge } from './ui/badge.jsx'
import { RevenueChart } from './RevenueChart.jsx'
import { CoursePieChart } from './CoursePieChart.jsx'
import { UTMSourceChart } from './UTMSourceChart.jsx'
import { UTMCampaignChart } from './UTMCampaignChart.jsx'
import { GeographicChart } from './GeographicChart.jsx'
import { CourseTimelineChart } from './CourseTimelineChart.jsx'
import { RecentSales } from './RecentSales.jsx'
import { MarketingKPIs } from './MarketingKPIs.jsx'
import { CourseTable } from './CourseTable.jsx'
import { 
  LogOut, 
  TrendingUp, 
  Users, 
  DollarSign, 
  BookOpen,
  BarChart3,
  PieChart,
  MapPin
} from 'lucide-react'

export function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    newStudents: 0,
    newLeads: 0,
    averageTicket: 0
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Buscar dados básicos para os KPIs
      const { data: matriculas, error: matriculasError } = await supabase
        .from('matriculas')
        .select('valor, data_compra')
        .order('data_compra', { ascending: false })

      if (matriculasError) {
        console.error('Erro ao buscar matrículas:', matriculasError)
        return
      }

      // Calcular estatísticas básicas
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      
      const currentMonthMatriculas = matriculas?.filter(m => {
        const date = new Date(m.data_compra)
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear
      }) || []

      const totalRevenue = currentMonthMatriculas.reduce((sum, m) => sum + (parseFloat(m.valor) || 0), 0)
      const newStudents = currentMonthMatriculas.length
      const averageTicket = newStudents > 0 ? totalRevenue / newStudents : 0

      // Buscar novos leads do mês atual
      const { data: leads, error: leadsError } = await supabase
        .from('Leads')
        .select('created_at')
        .gte('created_at', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`)

      const newLeads = leads?.length || 0

      setStats({
        totalRevenue,
        newStudents,
        newLeads,
        averageTicket
      })

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    window.location.reload()
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard Stomalovers</h1>
                <p className="text-sm text-gray-500">Analytics & Insights</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex items-center space-x-2">
              <PieChart className="w-4 h-4" />
              <span>Marketing</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Produtos</span>
            </TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita (Mês Atual)</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats.totalRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Novos Alunos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.newStudents}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Matrículas este mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Novos Leads</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.newLeads}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Contatos este mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(stats.averageTicket)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Por transação
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Receita ao Longo do Tempo</CardTitle>
                  <CardDescription>Evolução das vendas nos últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <RevenueChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Receita por Curso</CardTitle>
                  <CardDescription>Distribuição de vendas por produto (últimos 12 meses)</CardDescription>
                </CardHeader>
                <CardContent>
                  <CoursePieChart />
                </CardContent>
              </Card>
            </div>

            {/* Vendas Recentes */}
            <RecentSales />
          </TabsContent>

          {/* Marketing */}
          <TabsContent value="marketing" className="space-y-6">
            {/* KPIs de Marketing */}
            <MarketingKPIs />

            {/* Gráficos de Marketing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vendas por Canal</CardTitle>
                  <CardDescription>Receita gerada por fonte de tráfego (UTM Source)</CardDescription>
                </CardHeader>
                <CardContent>
                  <UTMSourceChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vendas por Campanha</CardTitle>
                  <CardDescription>Performance das campanhas de marketing (UTM Campaign)</CardDescription>
                </CardHeader>
                <CardContent>
                  <UTMCampaignChart />
                </CardContent>
              </Card>
            </div>

            {/* Distribuição Geográfica */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição Geográfica</CardTitle>
                <CardDescription>Número de alunos por estado</CardDescription>
              </CardHeader>
              <CardContent>
                <GeographicChart />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Produtos */}
          <TabsContent value="products" className="space-y-6">
            {/* Tabela de Cursos */}
            <CourseTable onCourseSelect={setSelectedCourse} />

            {/* Gráfico de Curso Específico */}
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Curso ao Longo do Tempo</CardTitle>
                <CardDescription>
                  {selectedCourse 
                    ? `Análise temporal de ${selectedCourse.nome}` 
                    : 'Selecione um curso na tabela acima para ver o gráfico'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CourseTimelineChart selectedCourse={selectedCourse} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

