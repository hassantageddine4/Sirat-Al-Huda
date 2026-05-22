// src/navigation/AppNavigator.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Root navigator wiring:
//   • Bottom tab bar with notification badge
//   • Stack navigators inside Community and Notifications tabs
//   • Auth guard: redirects to AuthScreen when not logged in
//
// Dependencies (install if not already present):
//   npm install @react-navigation/native @react-navigation/bottom-tabs
//              @react-navigation/native-stack
//              react-native-screens react-native-safe-area-context
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer }         from '@react-navigation/native';
import { createBottomTabNavigator }    from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator }  from '@react-navigation/native-stack';

import { supabase }            from '../lib/supabase';
import { useNotifications }    from '../hooks/useNotifications';

import CommunityScreen         from '../screens/CommunityScreen';
import PostDetailScreen        from '../screens/PostDetailScreen';
import JournalScreen           from '../screens/JournalScreen';
import NotificationsScreen     from '../screens/NotificationsScreen';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:       '#0F1B14',
  surface:  '#1A2B1F',
  border:   '#2A3F2E',
  accent:   '#C8A951',
  text:     '#F0EDE8',
  muted:    '#7A8A7E',
};

// ─────────────────────────────────────────────────────────────────────────────
// COMMUNITY STACK
// ─────────────────────────────────────────────────────────────────────────────
function CommunityStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown:      false,
        contentStyle:     { backgroundColor: C.bg },
        animation:        'slide_from_right',
      }}
    >
      <Stack.Screen name="CommunityFeed"   component={CommunityScreen} />
      <Stack.Screen name="PostDetail"      component={PostDetailScreen} />
    </Stack.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS STACK
// ─────────────────────────────────────────────────────────────────────────────
function NotificationsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown:  false,
        contentStyle: { backgroundColor: C.bg },
        animation:    'slide_from_right',
      }}
    >
      <Stack.Screen name="NotificationsList" component={NotificationsScreen} />
      <Stack.Screen name="PostDetail"        component={PostDetailScreen} />
    </Stack.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION BADGE (tab bar icon overlay)
// ─────────────────────────────────────────────────────────────────────────────
function TabIcon({ emoji, focused, badge = 0 }) {
  return (
    <View style={{ position: 'relative', width: 28, height: 28,
                   alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.55 }}>{emoji}</Text>
      {badge > 0 && (
        <View style={bs.badge}>
          <Text style={bs.badgeText}>{badge > 99 ? '99+' : badge}</Text>
        </View>
      )}
    </View>
  );
}

const bs = StyleSheet.create({
  badge:     { position: 'absolute', top: -3, right: -6, minWidth: 17, height: 17,
               borderRadius: 9, backgroundColor: '#EF4444',
               alignItems: 'center', justifyContent: 'center',
               paddingHorizontal: 3, borderWidth: 1.5, borderColor: C.bg },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
});

// ─────────────────────────────────────────────────────────────────────────────
// MAIN TAB NAVIGATOR
// ─────────────────────────────────────────────────────────────────────────────
function MainTabs() {
  // unreadCount feeds the badge — hook lives here so it persists across tab switches
  const { unreadCount } = useNotifications();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown:            false,
        tabBarStyle:            {
          backgroundColor:    C.surface,
          borderTopColor:     C.border,
          borderTopWidth:     1,
          height:             60,
          paddingBottom:      8,
        },
        tabBarActiveTintColor:  C.accent,
        tabBarInactiveTintColor:C.muted,
        tabBarLabelStyle:       { fontSize: 11, fontWeight: '600', marginTop: 0 },
      }}
    >
      <Tab.Screen
        name="Community"
        component={CommunityStack}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🌐" focused={focused} />,
          tabBarLabel: 'Community',
        }}
      />

      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📓" focused={focused} />,
          tabBarLabel: 'Journal',
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationsStack}
        options={{
          tabBarIcon: ({ focused }) =>
            <TabIcon emoji="🔔" focused={focused} badge={unreadCount} />,
          tabBarLabel: 'Notifications',
        }}
      />
    </Tab.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH GUARD + ROOT NAVIGATOR
// ─────────────────────────────────────────────────────────────────────────────
export default function AppNavigator() {
  const [session,  setSession]  = useState(undefined); // undefined = loading
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setChecking(false);
    });

    // Listen for auth state changes (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => setSession(s)
    );

    return () => subscription.unsubscribe();
  }, []);

  // Still resolving session from storage
  if (checking) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg,
                     alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: C.accent, fontSize: 28, fontWeight: '900',
                       letterSpacing: 4 }}>SIRAT</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH STACK (placeholder — replace with your real Auth screens)
// ─────────────────────────────────────────────────────────────────────────────
const AuthStack = createNativeStackNavigator();

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Replace with your real login/register screens */}
      <AuthStack.Screen name="Login" component={LoginPlaceholder} />
    </AuthStack.Navigator>
  );
}

function LoginPlaceholder() {
  return (
    <View style={{ flex: 1, backgroundColor: C.bg,
                   alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: C.text, fontSize: 18, fontWeight: '700' }}>
        Please sign in to continue.
      </Text>
    </View>
  );
}

// Re-export for convenience
export { CommunityStack, NotificationsStack };
