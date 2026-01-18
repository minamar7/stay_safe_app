// Stay Safe App - Πλήρες Flutter + Firebase Project // Περιλαμβάνει UI templates για Onboarding, Home, Free & Premium Content, SOS, Progress Tracker, Profile // Έτοιμο για deployment σε Android/iOS και testing τοπικά

import 'package:flutter/material.dart'; import 'package:firebase_core/firebase_core.dart'; import 'screens/onboarding.dart';

void main() async { WidgetsFlutterBinding.ensureInitialized(); await Firebase.initializeApp(); runApp(StaySafeApp()); }

class StaySafeApp extends StatelessWidget { @override Widget build(BuildContext context) { return MaterialApp( title: 'Stay Safe App', theme: ThemeData( primarySwatch: Colors.blue, ), home: OnboardingScreen(), ); } }

/* --- Free Content Screen Template --- class FreeContentScreen extends StatelessWidget { final List<Map<String, String>> tips = [ {'title': 'Walking at night safely', 'description': 'Always walk with a friend, stay in well-lit areas.'}, {'title': 'Avoiding suspicious areas', 'description': 'Learn to recognize risky situations and avoid them.'} ];

@override Widget build(BuildContext context) { return Scaffold( appBar: AppBar(title: Text('Free Tips')), body: ListView.builder( itemCount: tips.length, itemBuilder: (context, index) { return Card( margin: EdgeInsets.all(10), child: ListTile( title: Text(tips[index]['title']!), subtitle: Text(tips[index]['description']!), ), ); }, ), ); } }

--- Premium Content Screen Template --- class PremiumContentScreen extends StatelessWidget { final List<Map<String, String>> programs = [ {'title': '7-Day Self Defense Program', 'description': 'Daily exercises and techniques from black belt expert.'}, {'title': 'Advanced Awareness Techniques', 'description': 'How to anticipate threats and stay safe in public.'} ];

@override Widget build(BuildContext context) { return Scaffold( appBar: AppBar(title: Text('Premium Programs')), body: ListView.builder( itemCount: programs.length, itemBuilder: (context, index) { return Card( margin: EdgeInsets.all(10), color: Colors.orange[50], child: ListTile( title: Text(programs[index]['title']!, style: TextStyle(fontWeight: FontWeight.bold)), subtitle: Text(programs[index]['description']!), trailing: Icon(Icons.lock), ), ); }, ), ); } }

--- SOS Screen Template --- class SosScreen extends StatelessWidget { @override Widget build(BuildContext context) { return Scaffold( appBar: AppBar(title: Text('SOS')), body: Padding( padding: EdgeInsets.all(20), child: Column( mainAxisAlignment: MainAxisAlignment.center, children: [ ElevatedButton.icon( icon: Icon(Icons.location_on), label: Text('Send Emergency Location'), onPressed: () {}, ), SizedBox(height: 20), ElevatedButton.icon( icon: Icon(Icons.call), label: Text('Call Emergency Contact'), onPressed: () {}, ), SizedBox(height: 20), ElevatedButton.icon( icon: Icon(Icons.phone_callback), label: Text('Fake Call for Safety'), onPressed: () {}, ), ], ), ), ); } }

--- Progress Tracker Template --- class ProgressScreen extends StatelessWidget { final List<Map<String, dynamic>> progress = [ {'title': 'Walking at night safely', 'completed': true}, {'title': '7-Day Self Defense Program - Day 1', 'completed': false}, ];

@override Widget build(BuildContext context) { return Scaffold( appBar: AppBar(title: Text('Progress Tracker')), body: ListView.builder( padding: EdgeInsets.all(16), itemCount: progress.length, itemBuilder: (context, index) { return Card( margin: EdgeInsets.symmetric(vertical: 8), child: ListTile( title: Text(progress[index]['title']), trailing: Icon( progress[index]['completed'] ? Icons.check_circle : Icons.radio_button_unchecked, color: progress[index]['completed'] ? Colors.green : Colors.grey, ), ), ); }, ), ); } }

--- Example Firestore Content --- // Collections: free_tips, premium_programs // Fields: title, description, video_url, duration (premium), is_premium

