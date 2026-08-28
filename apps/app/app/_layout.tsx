import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerTitle: 'School Controller',
          headerStyle: {
            backgroundColor: '#f8fafc'
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: '#0f172a',
            fontWeight: '700'
          }
        }}
      />
      <StatusBar style="dark" />
    </>
  );
}
