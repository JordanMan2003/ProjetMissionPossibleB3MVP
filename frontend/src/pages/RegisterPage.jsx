
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Leaf, Upload, GraduationCap, Building, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialUserType = searchParams.get('type') || 'consumer';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: initialUserType,
    isStudent: false,
    studentProof: null,
    // Professional fields
    siret: '',
    iban: '',
    bic: '',
    producerCertification: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const userTypes = [
    { value: 'producer', label: 'Producteur local', icon: Leaf },
    { value: 'restaurant', label: 'Restaurant / Fast-food', icon: Building },
    { value: 'consumer', label: 'Consommateur', icon: User }
  ];

  // Validation functions
  const validateSiret = (siret) => {
/*     const cleanSiret = siret.replace(/\s/g, '');
    if (cleanSiret.length !== 14) return false;
    if (!/^\d{14}$/.test(cleanSiret)) return false; */
    
/*     // Luhn algorithm for SIRET validation
    let sum = 0;
    for (let i = 0; i < 14; i++) {
      let digit = parseInt(cleanSiret[i]);
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0; */
  };

  const validateIban = (iban) => {
    const cleanIban = iban.replace(/\s/g, '').toUpperCase();
    if (cleanIban.length < 15 || cleanIban.length > 34) return false;
    if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleanIban)) return false;
    
    // Basic IBAN format check (simplified)
    const countryCode = cleanIban.substring(0, 2);
    const checkDigits = cleanIban.substring(2, 4);
    return countryCode.match(/^[A-Z]{2}$/) && checkDigits.match(/^[0-9]{2}$/);
  };

  const validateBic = (bic) => {
    const cleanBic = bic.replace(/\s/g, '').toUpperCase();
    return /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(cleanBic);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = {};

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    if (formData.password.length < 8) {
      errors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }

    // Professional validation
    if (formData.userType === 'restaurant' || formData.userType === 'producer') {
      if (!formData.siret) {
        errors.siret = "Le numéro SIRET est obligatoire";
      }/*  else if (!validateSiret(formData.siret)) {
        errors.siret = "Le numéro SIRET n'est pas valide (14 chiffres requis)";
      } */

      if (!formData.iban) {
        errors.iban = "L'IBAN est obligatoire";
      } else if (!validateIban(formData.iban)) {
        errors.iban = "Le format IBAN n'est pas valide";
      }

      if (!formData.bic) {
        errors.bic = "Le code BIC/SWIFT est obligatoire";
      } else if (!validateBic(formData.bic)) {
        errors.bic = "Le format BIC/SWIFT n'est pas valide";
      }

      if (formData.userType === 'producer' && !formData.producerCertification) {
        errors.producerCertification = "Vous devez certifier être un producteur local";
      }
    }

    // Student validation
    if (formData.userType === 'consumer' && formData.isStudent && !formData.studentProof) {
      errors.studentProof = "Un justificatif étudiant est requis";
    }
    if (formData.userType === 'producer' && !formData.producerCertification) {
      errors.producerCertification = "Vous devez certifier être un producteur local";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs dans le formulaire",
        variant: "destructive"
      });
      return;
    }

    setValidationErrors({});
    setIsLoading(true);

    try {
      const userData = {
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.userType.toUpperCase(),
        ...(formData.userType !== 'consumer' && {
          siret: formData.siret,
          iban: formData.iban,
          bic: formData.bic,
        }),
        ...(formData.userType === 'producer' && {
          producerCertified: !!formData.producerCertification
        }),
        ...(formData.userType === 'consumer' && {
          isStudent: !!formData.isStudent,
          studentProof: formData.isStudent && formData.studentProof ? formData.studentProof.name : undefined
        })
      };

      const res = await register(userData);

      if (formData.userType === 'consumer') {
        toast({ title: "Inscription réussie !", description: "Bienvenue dans la communauté GreenCart" });
        navigate('/dashboard');
      } else {
        // Ne pas connecter automatiquement Producteur/Restaurant
        toast({ title: "Inscription reçue", description: "Votre compte sera vérifié sous 24-48h avant activation." });
        // Rester sur la page d'inscription
      }
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;

    // Format SIRET input
    if (name === 'siret') {
      processedValue = value.replace(/\D/g, '').substring(0, 14);
    }

    // Format IBAN input
    if (name === 'iban') {
      processedValue = value.replace(/[^A-Z0-9]/gi, '').toUpperCase().substring(0, 34);
    }

    // Format BIC input
    if (name === 'bic') {
      processedValue = value.replace(/[^A-Z0-9]/gi, '').toUpperCase().substring(0, 11);
    }

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : processedValue
    });

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: undefined
      });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowed = ['image/jpeg','image/jpg','image/png','application/pdf'];
      if (!allowed.includes(file.type)) {
        toast({ title: "Format non supporté", description: "Formats autorisés: JPG, PNG, PDF", variant: "destructive" });
        return;
      }
      if (file.size > maxSize) {
        toast({
          title: "Fichier trop volumineux",
          description: "Le fichier ne doit pas dépasser 5MB",
          variant: "destructive"
        });
        return;
      }

      setFormData({
        ...formData,
        studentProof: file
      });
      
      if (validationErrors.studentProof) {
        setValidationErrors({
          ...validationErrors,
          studentProof: undefined
        });
      }

      toast({
        title: "Fichier uploadé",
        description: `${file.name} a été ajouté avec succès`,
      });
    }
  };

  const formatSiretDisplay = (siret) => {
    return siret.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4');
  };

  const formatIbanDisplay = (iban) => {
    return iban.replace(/(.{4})/g, '$1 ').trim();
  };

  const isProfessional = formData.userType === 'restaurant' || formData.userType === 'producer';

  return (
    <>
      <Helmet>
        <title>Inscription - GreenCart</title>
        <meta name="description" content="Rejoignez la communauté GreenCart et participez au circuit court et à la lutte contre le gaspillage alimentaire." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex items-center justify-center p-4">
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2322c55e" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30`}></div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl relative"
        >
          <div className="glass-effect rounded-2xl p-8 shadow-2xl">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 group">
                <img 
                  src="https://storage.googleapis.com/hostinger-horizons-assets-prod/ec0ab4bd-14e9-481f-8956-c54da0a58c6c/d9d4a8ceeaa16401b82e359734e11920.png" 
                  alt="Logo GreenCart" 
                  className="w-12 h-12 group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-3xl font-bold gradient-text">GreenCart</span>
              </Link>
              <p className="text-gray-600 mt-2">Rejoignez notre communauté</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Type de compte
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {userTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all duration-300 ${
                        formData.userType === type.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-green-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="userType"
                        value={type.value}
                        checked={formData.userType === type.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <type.icon className={`w-5 h-5 ${
                        formData.userType === type.value ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <span className={`text-sm font-medium ${
                        formData.userType === type.value ? 'text-green-800' : 'text-gray-700'
                      }`}>
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Professional Information */}
              {isProfessional && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-800">
                      Informations professionnelles
                    </h3>
                  </div>
                  <p className="text-sm text-blue-700 mb-4">
                    🛡️ Ces informations sont obligatoires et sécurisées. Elles ne seront jamais affichées publiquement.
                  </p>

                  {/* SIRET */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Numéro SIRET {formData.userType === 'producer' && '(ou n° d\'exploitation agricole)'}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="siret"
                        value={formatSiretDisplay(formData.siret)}
                        onChange={handleChange}
                        placeholder="123 456 789 01234"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          validationErrors.siret 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                        }`}
                      />
                      {formData.siret && validateSiret(formData.siret) && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                    {validationErrors.siret && (
                      <p className="text-red-500 text-sm">{validationErrors.siret}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      14 chiffres requis. Validation automatique du format.
                    </p>
                  </div>

                  {/* IBAN */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      IBAN
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="iban"
                        value={formatIbanDisplay(formData.iban)}
                        onChange={handleChange}
                        placeholder="FR14 2004 1010 0505 0001 3M02 606"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          validationErrors.iban 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                        }`}
                      />
                      {formData.iban && validateIban(formData.iban) && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                    {validationErrors.iban && (
                      <p className="text-red-500 text-sm">{validationErrors.iban}</p>
                    )}
                  </div>

                  {/* BIC */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Code BIC/SWIFT
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="bic"
                        value={formData.bic}
                        onChange={handleChange}
                        placeholder="BNPAFRPP"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          validationErrors.bic 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                        }`}
                      />
                      {formData.bic && validateBic(formData.bic) && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                    {validationErrors.bic && (
                      <p className="text-red-500 text-sm">{validationErrors.bic}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      8 ou 11 caractères (lettres et chiffres)
                    </p>
                  </div>

                  {/* Producer Certification */}
                  {formData.userType === 'producer' && (
                    <div className="space-y-2">
                      <label className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all duration-300 ${
                        validationErrors.producerCertification 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-300 hover:border-green-300'
                      }`}>
                        <input
                          type="checkbox"
                          name="producerCertification"
                          checked={formData.producerCertification}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Shield className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">
                              Certification producteur local
                              <span className="text-red-500 ml-1">*</span>
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            Je certifie sur l'honneur être un producteur local ou une exploitation enregistrée légalement.
                          </p>
                        </div>
                      </label>
                      {validationErrors.producerCertification && (
                        <p className="text-red-500 text-sm">{validationErrors.producerCertification}</p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Student Option */}
              {formData.userType === 'consumer' && (
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-xl cursor-pointer hover:border-green-300 transition-all duration-300">
                    <input
                      type="checkbox"
                      name="isStudent"
                      checked={formData.isStudent}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <GraduationCap className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Je suis étudiant
                    </span>
                  </label>

                  {formData.isStudent && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileUpload}
                        className="sr-only"
                        id="student-proof"
                      />
                      <label
                        htmlFor="student-proof"
                        className={`flex items-center gap-3 p-3 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                          validationErrors.studentProof 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-300 hover:border-green-300'
                        }`}
                      >
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.studentProof ? formData.studentProof.name : 'Justificatif étudiant (.jpg, .pdf) - Max 5MB'}
                        </span>
                        {formData.studentProof && (
                          <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                        )}
                      </label>
                      {validationErrors.studentProof && (
                        <p className="text-red-500 text-sm">{validationErrors.studentProof}</p>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nom complet"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Adresse email"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mot de passe (min. 8 caractères)"
                    required
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                      validationErrors.password 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-red-500 text-sm">{validationErrors.password}</p>
                )}

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmer le mot de passe"
                    required
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                      validationErrors.confirmPassword 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-red-500 text-sm">{validationErrors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full green-gradient green-gradient-hover text-white py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
              </Button>

              {isProfessional && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-700 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Votre compte sera vérifié par notre équipe sous 24-48h avant activation.
                  </p>
                </div>
              )}
            </form>

            {/* Links */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Déjà un compte ?{' '}
                <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                  Connectez-vous
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default RegisterPage;
