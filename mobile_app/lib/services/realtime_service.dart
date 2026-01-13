import 'dart:async';
import 'package:socket_io_client/socket_io_client.dart' as io;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/foundation.dart';
import '../core/api_config.dart';

final realtimeServiceProvider = Provider<RealtimeService>((ref) {
  final service = RealtimeService();
  service.init();
  ref.onDispose(() => service.dispose());
  return service;
});

class RealtimeService {
  late io.Socket socket;
  final _aiResponseController = StreamController<String>.broadcast();

  Stream<String> get aiResponseStream => _aiResponseController.stream;

  void init() {
    socket = io.io(
      ApiConfig.baseUrl,
      io.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .build(),
    );

    socket.connect();

    socket.onConnect((_) {
      debugPrint('✅ Realtime Service: Connected to Server');
    });

    socket.onDisconnect((_) => debugPrint('❌ Realtime Service: Disconnected'));

    // Listen for AI chunks
    socket.on('ai_chunk', (data) {
      if (data != null && data['text'] != null) {
        _aiResponseController.add(data['text']);
      }
    });

    socket.on('ai_error', (data) {
      debugPrint('⚠️ AI Error: ${data['message']}');
      _aiResponseController.addError(data['message']);
    });
  }

  void askAi(String prompt, String systemInstruction) {
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit('ask_ai', {
      'prompt': prompt,
      'systemInstruction': systemInstruction,
    });
  }

  void dispose() {
    socket.dispose();
    _aiResponseController.close();
  }
}
