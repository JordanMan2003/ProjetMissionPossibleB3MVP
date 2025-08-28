import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Package, ShoppingCart, Tag, Plus, Edit, Trash2, 
  Eye, Search, Filter, Download, Upload, Settings, BarChart3,
  CheckCircle, XCircle, Clock, DollarSign, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import apiService from '@/services/api';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('view');
  
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();



  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load dashboard stats
        const stats = await apiService.getDashboardStats();
        
        // Load users, products, orders, categories
        const [usersData, productsData, ordersData, categoriesData] = await Promise.all([
          apiService.getAllUsers(),
          apiService.getAllProducts(),
          apiService.getAllOrders(),
          apiService.getAllCategories()
        ]);

        setUsers(usersData);
        setProducts(productsData);
        setOrders(ordersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load admin data:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les données d'administration",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart },
    { id: 'categories', label: 'Catégories', icon: Tag },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'PAID':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
      case 'CANCELLED':
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const Modal = () => {
    const [form, setForm] = useState(selectedItem || {});
    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    if (!isModalOpen) return null;
    const titleMap = { create: 'Créer', edit: 'Modifier', view: 'Détails' };
    const currentType = activeTab;
    const isReadOnly = modalType === 'view';
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={closeModal}>
        <div className="bg-white rounded-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              {titleMap[modalType]} {currentType}
            </h3>
            <button onClick={closeModal}>✕</button>
          </div>
          <div className="space-y-3">
            {currentType === 'users' && (
              <>
                <input disabled={isReadOnly} name="fullName" placeholder="Nom complet" value={form.fullName || ''} onChange={onChange} className="w-full border p-2 rounded" />
                <input disabled={isReadOnly} name="email" placeholder="Email" value={form.email || ''} onChange={onChange} className="w-full border p-2 rounded" />
                {modalType !== 'create' && (
                  <div className="flex gap-2">
                    <Button onClick={() => handleCreateOrUpdate('users', { approveId: form.id })} className="green-gradient text-white">Approuver</Button>
                    <Button variant="outline" onClick={() => handleCreateOrUpdate('users', { rejectId: form.id })}>Refuser</Button>
                  </div>
                )}
              </>
            )}
            {currentType === 'products' && (
              <>
                <input disabled={isReadOnly} name="name" placeholder="Nom" value={form.name || ''} onChange={onChange} className="w-full border p-2 rounded" />
                <input disabled={isReadOnly} name="price" placeholder="Prix" value={form.price || ''} onChange={onChange} className="w-full border p-2 rounded" />
                <input disabled={isReadOnly} name="stock" placeholder="Stock" value={form.stock || ''} onChange={onChange} className="w-full border p-2 rounded" />
                <input disabled={isReadOnly} name="region" placeholder="Région" value={form.region || ''} onChange={onChange} className="w-full border p-2 rounded" />
                <input disabled={isReadOnly} name="producer" placeholder="Producteur" value={form.producer || ''} onChange={onChange} className="w-full border p-2 rounded" />
              </>
            )}
            {currentType === 'categories' && (
              <>
                <input disabled={isReadOnly} name="name" placeholder="Nom" value={form.name || ''} onChange={onChange} className="w-full border p-2 rounded" />
                <input disabled={isReadOnly} name="slug" placeholder="Slug" value={form.slug || ''} onChange={onChange} className="w-full border p-2 rounded" />
              </>
            )}
            {currentType === 'orders' && (
              <>
                <select disabled={isReadOnly} name="status" value={form.status || ''} onChange={onChange} className="w-full border p-2 rounded">
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="FAILED">FAILED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </>
            )}
          </div>
          {modalType !== 'view' && (
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={closeModal}>Annuler</Button>
              <Button className="green-gradient text-white" onClick={() => handleCreateOrUpdate(currentType, form)}>
                Enregistrer
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'PAID':
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'REJECTED':
      case 'CANCELLED':
      case 'inactive':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = async (type, id) => {
    try {
      switch (type) {
        case 'users':
          await apiService.deleteUser(id);
          break;
        case 'products':
          await apiService.deleteProduct(id);
          break;
        case 'categories':
          await apiService.deleteCategory(id);
          break;
        default:
          throw new Error('Type non supporté');
      }

      toast({
        title: "Suppression réussie",
        description: "L'élément a été supprimé avec succès",
      });

      // Reload data
      await reloadAll();
    } catch (error) {
      console.error('Delete failed:', error);
      toast({
        title: "Erreur de suppression",
        description: "Impossible de supprimer l'élément",
        variant: "destructive"
      });
    }
  };

  const handleCreateOrUpdate = async (type, payload) => {
    try {
      switch (type) {
        case 'users':
          if (payload.id) await apiService.updateUser(payload.id, payload);
          if (payload.approveId) await apiService.updateUserStatus(payload.approveId, 'APPROVED');
          if (payload.rejectId) await apiService.updateUserStatus(payload.rejectId, 'REJECTED');
          break;
        case 'products':
          if (payload.id) await apiService.updateProduct(payload.id, payload);
          else await apiService.createProduct(payload);
          break;
        case 'categories':
          if (payload.id) await apiService.updateCategory(payload.id, payload);
          else await apiService.createCategory(payload);
          break;
        case 'orders':
          if (payload.id && payload.status) await apiService.updateOrderStatus(payload.id, payload.status);
          break;
        default:
          throw new Error('Type non supporté');
      }
      toast({ title: 'Succès', description: 'Opération effectuée' });
      setIsModalOpen(false);
      setSelectedItem(null);
      await reloadAll();
    } catch (error) {
      console.error('Create/Update failed:', error);
      toast({ title: 'Erreur', description: `Opération échouée: ${error.message}`, variant: 'destructive' });
    }
  };

  const reloadAll = async () => {
    const [usersData, productsData, ordersData, categoriesData] = await Promise.all([
      apiService.getAllUsers(),
      apiService.getAllProducts(),
      apiService.getAllOrders(),
      apiService.getAllCategories()
    ]);

    setUsers(usersData);
    setProducts(productsData);
    setOrders(ordersData);
    setCategories(categoriesData);
  };

  const DashboardStats = () => {
    const [stats, setStats] = useState({
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      pendingUsers: 0,
      activeProducts: 0,
      pendingOrders: 0
    });

    useEffect(() => {
      const loadStats = async () => {
        try {
          const dashboardStats = await apiService.getDashboardStats();
          setStats(dashboardStats);
        } catch (error) {
          console.error('Failed to load stats:', error);
        }
      };

      loadStats();
    }, []);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilisateurs totaux</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{stats.userGrowth || 0}% ce mois
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Produits actifs</p>
              <p className="text-3xl font-bold text-gray-800">{stats.activeProducts}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{stats.productGrowth || 0}% ce mois
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Commandes</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{stats.orderGrowth || 0}% ce mois
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chiffre d'affaires</p>
              <p className="text-3xl font-bold text-gray-800">
                {Number(stats.totalRevenue).toFixed(0)}€
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{stats.revenueGrowth || 0}% ce mois
          </div>
        </motion.div>
      </div>
    );
  };

  const DataTable = ({ data, columns, type }) => {
    const filteredData = data.filter(item => {
      const term = searchTerm.trim().toLowerCase();
      if (!term) return true;
      return Object.entries(item).some(([key, value]) => {
        if (value == null) return false;
        if (typeof value === 'object') return JSON.stringify(value).toLowerCase().includes(term);
        return String(value).toLowerCase().includes(term);
      });
    });

    return (
      <div className="glass-effect rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              {type === 'users' && 'Utilisateurs'}
              {type === 'products' && 'Produits'}
              {type === 'orders' && 'Commandes'}
              {type === 'categories' && 'Catégories'}
            </h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <Button onClick={() => openModal(type === 'orders' ? 'edit' : 'create', null)} className="green-gradient text-white">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.render ? column.render(item[column.key], item) : item[column.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                       <button
                         onClick={() => openModal('view', item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal('edit', item)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(type, item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats />;
      
      case 'users':
        return (
          <DataTable
            data={users}
            type="users"
            columns={[
              { key: 'fullName', label: 'Nom complet' },
              { key: 'email', label: 'Email' },
              { key: 'role', label: 'Rôle' },
              { 
                key: 'accountStatus', 
                label: 'Statut',
                render: (value) => (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
                    {getStatusIcon(value)}
                    <span className="ml-1">{value}</span>
                  </span>
                )
              },
              { 
                key: 'createdAt', 
                label: 'Date de création',
                render: (value) => new Date(value).toLocaleDateString('fr-FR')
              },
            ]}
          />
        );
      
      case 'products':
        return (
          <DataTable
            data={products}
            type="products"
            columns={[
              { key: 'name', label: 'Nom' },
              { key: 'price', label: 'Prix', render: (value) => `${Number(value).toFixed(2)}€` },
              { key: 'stock', label: 'Stock' },
              { 
                key: 'owner', 
                label: 'Propriétaire',
                render: (value) => value?.fullName || 'N/A'
              },
              { 
                key: 'category', 
                label: 'Catégorie',
                render: (value) => value?.name || 'N/A'
              },
              { 
                key: 'stock', 
                label: 'Statut',
                render: (value) => (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${value > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {value > 0 ? getStatusIcon('active') : getStatusIcon('inactive')}
                    <span className="ml-1">{value > 0 ? 'Actif' : 'Inactif'}</span>
                  </span>
                )
              },
            ]}
          />
        );
      
      case 'orders':
        return (
          <DataTable
            data={orders}
            type="orders"
            columns={[
              { key: 'id', label: 'ID' },
              { 
                key: 'user', 
                label: 'Client',
                render: (value) => value?.fullName || 'N/A'
              },
              { key: 'total', label: 'Total', render: (value) => `${Number(value).toFixed(2)}€` },
              { 
                key: 'status', 
                label: 'Statut',
                render: (value) => (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
                    {getStatusIcon(value)}
                    <span className="ml-1">{value}</span>
                  </span>
                )
              },
              { 
                key: 'createdAt', 
                label: 'Date',
                render: (value) => new Date(value).toLocaleDateString('fr-FR')
              },
            ]}
          />
        );
      
      case 'categories':
        return (
          <DataTable
            data={categories}
            type="categories"
            columns={[
              { key: 'name', label: 'Nom' },
              { key: 'slug', label: 'Slug' },
              { 
                key: '_count', 
                label: 'Produits',
                render: (value) => value?.products || 0
              },
            ]}
          />
        );
      
      default:
        return <DashboardStats />;
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'administration...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Administration - GreenCart</title>
        <meta name="description" content="Interface d'administration GreenCart pour la gestion des utilisateurs, produits et commandes." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
        <Header />
        
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold gradient-text mb-4">
                Administration GreenCart
              </h1>
              <p className="text-xl text-gray-600">
                Gérez vos utilisateurs, produits et commandes
              </p>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-effect rounded-2xl p-2 mb-8"
            >
              <div className="flex space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'green-gradient text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {renderTabContent()}
              <Modal />
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default AdminPage;
