"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Car,
  CheckCircle,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  Shield,
  Star,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 text-sm">
              🚗 Solution de gestion pour garages
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Révolutionnez la gestion
              <span className="text-blue-600 dark:text-blue-400">
                {" "}
                de votre garage
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Suivez les réparations en temps réel, gérez vos clients et
              communiquez facilement. Une solution complète pour moderniser
              votre atelier automobile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/signup">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6"
                asChild
              >
                <Link href="/login">Se connecter</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Une plateforme complète pour gérer efficacement votre garage
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Suivi des réparations</CardTitle>
                <CardDescription>
                  Suivez chaque étape de la réparation en temps réel. Vos
                  clients voient l'avancement instantanément.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Gestion des clients</CardTitle>
                <CardDescription>
                  Créez et gérez facilement les fiches clients avec l'historique
                  complet de leurs véhicules.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Chat en ligne</CardTitle>
                <CardDescription>
                  Communiquez directement avec vos clients pour répondre à leurs
                  questions et conseils.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                  <Car className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Historique des véhicules</CardTitle>
                <CardDescription>
                  Conservez un historique détaillé de toutes les interventions
                  sur chaque véhicule.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Photos en temps réel</CardTitle>
                <CardDescription>
                  Partagez des photos des réparations pour plus de transparence
                  avec vos clients.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle>Sécurisé et fiable</CardTitle>
                <CardDescription>
                  Vos données sont protégées avec Firebase et hébergées sur des
                  serveurs sécurisés.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Pourquoi choisir Garage Connect ?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Gain de temps considérable
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Automatisez le suivi des réparations et réduisez les
                      appels téléphoniques de 70%.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Satisfaction client améliorée
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Vos clients apprécient la transparence et la communication
                      en temps réel.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Organisation parfaite
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Tous vos dossiers clients et réparations centralisés en un
                      seul endroit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Prêt à commencer ?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Rejoignez des centaines de garages qui font confiance à
                    Garage Connect
                  </p>
                  <Button size="lg" className="w-full max-w-xs mx-auto" asChild>
                    <Link href="/signup">Créer mon compte gratuit</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à moderniser votre garage ?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Commencez dès aujourd'hui et transformez la façon dont vous gérez
            vos réparations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6"
              asChild
            >
              <Link href="/signup">Essayer gratuitement</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
              asChild
            >
              <Link href="/login">Se connecter</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Garage Connect
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                La solution complète pour moderniser la gestion de votre garage
                automobile.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Fonctionnalités
              </h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>Suivi des réparations</li>
                <li>Gestion des clients</li>
                <li>Chat en ligne</li>
                <li>Historique véhicules</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Support
              </h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>Documentation</li>
                <li>Centre d'aide</li>
                <li>Contact</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact
              </h4>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  contact@garageconnect.fr
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +33 1 23 45 67 89
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-600 dark:text-gray-300">
            <p>&copy; 2024 Garage Connect. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
