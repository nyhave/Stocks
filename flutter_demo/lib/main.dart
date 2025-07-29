import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'firebase_options.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final _actionController = TextEditingController();
  final _amountController = TextEditingController();

  Future<void> _save() async {
    final action = _actionController.text;
    final amount = double.tryParse(_amountController.text) ?? 0;
    await FirebaseFirestore.instance.collection('portfolio').add({
      'action': action,
      'amount': amount,
      'timestamp': FieldValue.serverTimestamp(),
    });
    _actionController.clear();
    _amountController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SmartPortfolio Demo',
      home: Scaffold(
        appBar: AppBar(title: const Text('SmartPortfolio Demo')),
        body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              TextField(
                controller: _actionController,
                decoration: const InputDecoration(labelText: 'Action'),
              ),
              TextField(
                controller: _amountController,
                decoration: const InputDecoration(labelText: 'Amount'),
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 12),
              ElevatedButton(onPressed: _save, child: const Text('Save')),
              const SizedBox(height: 12),
              Expanded(
                child: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
                  stream: FirebaseFirestore.instance
                      .collection('portfolio')
                      .orderBy('timestamp')
                      .snapshots(),
                  builder: (context, snapshot) {
                    if (!snapshot.hasData) {
                      return const Center(child: CircularProgressIndicator());
                    }
                    final docs = snapshot.data!.docs;
                    return ListView(
                      children: [
                        for (final doc in docs)
                          ListTile(
                            title: Text(doc.data()['action'] ?? ''),
                            subtitle: Text(
                                (doc.data()['amount'] ?? '').toString()),
                          )
                      ],
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
