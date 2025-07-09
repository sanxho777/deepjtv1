@@ .. @@
   const handleStartNavigation = () => {
     if (!ball?.connected) {
-      Alert.alert('Error', 'Please connect to a ball first');
+      Alert.alert(
+        'Ball Not Connected', 
+        'You need to connect to a golf ball before starting navigation. Please go to the Balls tab and connect to a ball first.',
+        [
+          { text: 'OK', style: 'cancel' },
+          { text: 'Go to Balls', onPress: () => Alert.alert('Navigation', 'This would navigate to the Balls tab') }
+        ]
+      );
       return;
     }
     
     setIsNavigating(true);
     setCurrentStep(0);
     setVoiceEnabled(true);
-    Alert.alert('Navigation Started', 'Turn-by-turn navigation has begun');
+    Alert.alert('Navigation Started', 'Turn-by-turn navigation has begun. Follow the on-screen directions to find your ball.');
   };

   const handleNextStep = () => {
@@ .. @@
   const handleFoundBall = () => {
     setIsNavigating(false);
     setCurrentStep(0);
-    Alert.alert('Ball Found', 'Great job! Ball marked as found.');
+    Alert.alert(
+      'Ball Found!', 
+      'Congratulations! You\'ve successfully found your golf ball. The navigation session has ended.',
+      [
+        { text: 'Continue Playing', style: 'cancel' },
+        { text: 'Mark Ball as Lost', style: 'destructive', onPress: () => Alert.alert('Ball Marked', 'Ball marked as lost in your game statistics') }
+      ]
+    );
     onClose();
   };

   const handleRecenter = () => {
-    Alert.alert('Map Recentered', 'GPS position recalibrated');
+    Alert.alert(
+      'Recalibrating GPS', 
+      'Updating your position...',
+      [{ text: 'OK' }]
+    );
+    setTimeout(() => {
+      Alert.alert('GPS Updated', 'Your position has been recalibrated successfully');
+    }, 1000);
   };

   const toggleVoice = () => {
     setVoiceEnabled(!voiceEnabled);
-    Alert.alert('Voice Navigation', voiceEnabled ? 'Voice disabled' : 'Voice enabled');
+    Alert.alert(
+      'Voice Navigation', 
+      voiceEnabled ? 'Voice instructions have been disabled' : 'Voice instructions have been enabled'
+    );
   };