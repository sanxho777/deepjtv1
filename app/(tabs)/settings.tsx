import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings as SettingsIcon, User, Bell, Shield, CircleHelp as HelpCircle, Info, LogOut, ChevronRight, Moon, Vibrate, Globe, Smartphone, Database, Trash2, Download, Upload, Mail, MessageCircle, Star, Zap, Battery, Wifi } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileModal from '../../components/ProfileModal';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  color?: string;
}

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [batteryOptimization, setBatteryOptimization] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => Alert.alert('Signed Out', 'You have been signed out successfully') }
      ]
    );
  };

  const handleDataExport = () => {
    Alert.alert(
      'Export Data',
      'Export all your golf data including scores, statistics, and ball tracking history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: () => {
            Alert.alert('Export Started', 'Your data export has been started. You will receive an email when it\'s ready.');
            // Simulate export process
            setTimeout(() => {
              Alert.alert('Export Complete', 'Your data has been exported successfully!');
            }, 2000);
          }
        }
      ]
    );
  };

  const handleDataImport = () => {
    Alert.alert(
      'Import Data',
      'Import golf data from another device or backup?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Import', 
          onPress: () => {
            Alert.alert('Import Started', 'Importing your data...');
            setTimeout(() => {
              Alert.alert('Import Complete', 'Your data has been imported successfully!');
            }, 1500);
          }
        }
      ]
    );
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all your golf data, including scores, statistics, and ball tracking history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive', 
          onPress: () => {
            Alert.alert('Deleting...', 'Removing all data...');
            setTimeout(() => {
              Alert.alert('Data Deleted', 'All your data has been permanently deleted.');
            }, 1000);
          }
        }
      ]
    );
  };

  const handleSaveProfile = (profileData: any) => {
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleHelpPress = () => {
    Alert.alert(
      'Help & Support',
      'Choose how you\'d like to get help:',
      [
        { text: 'FAQ', onPress: () => Alert.alert('FAQ', 'Frequently asked questions would open here') },
        { text: 'Contact Support', onPress: () => Alert.alert('Contact Support', 'Support contact form would open here') },
        { text: 'User Guide', onPress: () => Alert.alert('User Guide', 'User guide would open here') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleFeedbackPress = () => {
    Alert.alert(
      'Send Feedback',
      'We\'d love to hear from you!',
      [
        { text: 'Bug Report', onPress: () => Alert.alert('Bug Report', 'Bug report form would open here') },
        { text: 'Feature Request', onPress: () => Alert.alert('Feature Request', 'Feature request form would open here') },
        { text: 'General Feedback', onPress: () => Alert.alert('General Feedback', 'Feedback form would open here') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate JackTrack',
      'Enjoying JackTrack? Please rate us on the App Store!',
      [
        { text: 'Maybe Later', style: 'cancel' },
        { text: 'Rate Now', onPress: () => Alert.alert('Thank You!', 'Thank you for rating JackTrack!') }
      ]
    );
  };

  const handleAboutPress = () => {
    Alert.alert(
      'About JackTrack',
      'JackTrack v1.0.0\n\nThe ultimate golf ball tracking app for serious golfers.\n\nBuilt with ❤️ for golfers everywhere.\n\n© 2024 JackTrack. All rights reserved.',
      [
        { text: 'Privacy Policy', onPress: () => Alert.alert('Privacy Policy', 'Privacy policy would open here') },
        { text: 'Terms of Service', onPress: () => Alert.alert('Terms of Service', 'Terms of service would open here') },
        { text: 'OK', style: 'cancel' }
      ]
    );
  };

  const handleLanguagePress = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language:',
      [
        { text: 'English', onPress: () => Alert.alert('Language', 'Language set to English') },
        { text: 'Spanish', onPress: () => Alert.alert('Language', 'Language set to Spanish') },
        { text: 'French', onPress: () => Alert.alert('Language', 'Language set to French') },
        { text: 'German', onPress: () => Alert.alert('Language', 'Language set to German') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleUnitsPress = () => {
    Alert.alert(
      'Measurement Units',
      'Choose your preferred units:',
      [
        { text: 'Imperial (Yards, °F)', onPress: () => Alert.alert('Units', 'Units set to Imperial') },
        { text: 'Metric (Meters, °C)', onPress: () => Alert.alert('Units', 'Units set to Metric') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleConnectionTimeoutPress = () => {
    Alert.alert(
      'Connection Timeout',
      'Set the timeout for ball connections:',
      [
        { text: '15 seconds', onPress: () => Alert.alert('Timeout', 'Timeout set to 15 seconds') },
        { text: '30 seconds', onPress: () => Alert.alert('Timeout', 'Timeout set to 30 seconds') },
        { text: '60 seconds', onPress: () => Alert.alert('Timeout', 'Timeout set to 60 seconds') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handlePrivacyPress = () => {
    Alert.alert(
      'Privacy & Security',
      'Manage your privacy and security settings:',
      [
        { text: 'Data Privacy', onPress: () => Alert.alert('Data Privacy', 'Data privacy settings would open here') },
        { text: 'Location Services', onPress: () => Alert.alert('Location Services', 'Location settings would open here') },
        { text: 'Permissions', onPress: () => Alert.alert('Permissions', 'App permissions would open here') },
        { text: 'Cancel', style: 'cancel' }
        }
      ]
    );
  };

  const profileSettings: SettingItem[] = [
    {
      id: 'profile',
      title: 'Profile',
      subtitle: 'Manage your account and preferences',
      icon: User,
      type: 'navigation',
      onPress: () => setShowProfileModal(true),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Push notifications and alerts',
      icon: Bell,
      type: 'toggle',
      value: notifications,
      onToggle: setNotifications,
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      subtitle: 'Data protection and security settings',
      icon: Shield,
      type: 'navigation',
      onPress: handlePrivacyPress,
    },
  ];

  const appSettings: SettingItem[] = [
    {
      id: 'darkMode',
      title: 'Dark Mode',
      subtitle: 'Switch between light and dark themes',
      icon: Moon,
      type: 'toggle',
      value: darkMode,
      onToggle: setDarkMode,
    },
    {
      id: 'vibration',
      title: 'Vibration',
      subtitle: 'Haptic feedback for interactions',
      icon: Vibrate,
      type: 'toggle',
      value: vibration,
      onToggle: setVibration,
    },
    {
      id: 'language',
      title: 'Language',
      subtitle: 'English',
      icon: Globe,
      type: 'navigation',
      onPress: handleLanguagePress,
    },
    {
      id: 'units',
      title: 'Units',
      subtitle: 'Yards, Fahrenheit',
      icon: Smartphone,
      type: 'navigation',
      onPress: handleUnitsPress,
    },
  ];

  const trackingSettings: SettingItem[] = [
    {
      id: 'autoSync',
      title: 'Auto Sync',
      subtitle: 'Automatically sync data with cloud',
      icon: Wifi,
      type: 'toggle',
      value: autoSync,
      onToggle: setAutoSync,
    },
    {
      id: 'batteryOptimization',
      title: 'Battery Optimization',
      subtitle: 'Optimize for longer battery life',
      icon: Battery,
      type: 'toggle',
      value: batteryOptimization,
      onToggle: setBatteryOptimization,
    },
    {
      id: 'connectionTimeout',
      title: 'Connection Timeout',
      subtitle: '30 seconds',
      icon: Zap,
      type: 'navigation',
      onPress: handleConnectionTimeoutPress,
    },
  ];

  const dataSettings: SettingItem[] = [
    {
      id: 'export',
      title: 'Export Data',
      subtitle: 'Download your golf data',
      icon: Download,
      type: 'action',
      onPress: handleDataExport,
    },
    {
      id: 'import',
      title: 'Import Data',
      subtitle: 'Restore from backup',
      icon: Upload,
      type: 'action',
      onPress: handleDataImport,
    },
    {
      id: 'deleteAll',
      title: 'Delete All Data',
      subtitle: 'Permanently delete all data',
      icon: Trash2,
      type: 'action',
      onPress: handleDeleteAllData,
      color: '#ef4444',
    },
  ];

  const supportSettings: SettingItem[] = [
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: HelpCircle,
      type: 'navigation',
      onPress: handleHelpPress,
    },
    {
      id: 'feedback',
      title: 'Send Feedback',
      subtitle: 'Share your thoughts and suggestions',
      icon: MessageCircle,
      type: 'navigation',
      onPress: handleFeedbackPress,
    },
    {
      id: 'rate',
      title: 'Rate App',
      subtitle: 'Rate us on the App Store',
      icon: Star,
      type: 'navigation',
      onPress: handleRateApp,
    },
    {
      id: 'about',
      title: 'About',
      subtitle: 'App version and information',
      icon: Info,
      type: 'navigation',
      onPress: handleAboutPress,
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    const IconComponent = item.icon;
    const iconColor = item.color || '#6b7280';
    
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.onPress}
        disabled={item.type === 'toggle'}
      >
        <View style={styles.settingLeft}>
          <View style={[styles.settingIcon, { backgroundColor: `${iconColor}15` }]}>
            <IconComponent color={iconColor} size={20} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            {item.subtitle && (
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.settingRight}>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: '#f3f4f6', true: '#bbf7d0' }}
              thumbColor={item.value ? '#16a34a' : '#d1d5db'}
            />
          )}
          {item.type === 'navigation' && (
            <ChevronRight color="#d1d5db" size={20} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (title: string, items: SettingItem[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {items.map((item, index) => (
          <View key={item.id}>
            {renderSettingItem(item)}
            {index < items.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#16a34a', '#059669']}
        style={styles.header}
      >
        <SafeAreaView style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Settings</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.profileButton}>
                <User color="#ffffff" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {renderSection('Account', profileSettings)}
        {renderSection('Appearance', appSettings)}
        {renderSection('Ball Tracking', trackingSettings)}
        {renderSection('Data Management', dataSettings)}
        {renderSection('Support', supportSettings)}
        
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut color="#ef4444" size={20} />
              <Text style={styles.logoutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>JackTrack v1.0.0</Text>
          <Text style={styles.footerSubtext}>© 2024 JackTrack. All rights reserved.</Text>
        </View>
      </ScrollView>

      <ProfileModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSave={handleSaveProfile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingBottom: 16,
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  profileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  settingRight: {
    marginLeft: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 68,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ef4444',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
});