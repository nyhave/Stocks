import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SmartPortfolio Demo',
      home: Scaffold(
        appBar: AppBar(title: const Text('SmartPortfolio Demo')),
        body: const Center(child: Text('Flutter web demo placeholder')),
      ),
    );
  }
}
