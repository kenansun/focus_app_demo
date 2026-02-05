package com.focusflow.app.services;

import android.app.Service;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;

public class FocusTimerService extends Service {
  public static final String CHANNEL_ID = "focus_timer_channel";

  @Override
  public void onCreate() {
    super.onCreate();
    createNotificationChannel();
  }

  @Override
  public int onStartCommand(Intent intent, int flags, int startId) {
    String mode = intent != null ? intent.getStringExtra("mode") : "focus";
    Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
      .setContentTitle("FocusFlow")
      .setContentText("Timer running (" + mode + ")")
      .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
      .setOngoing(true)
      .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE)
      .build();
    startForeground(1001, notification);
    return START_STICKY;
  }

  @Override
  public void onDestroy() {
    super.onDestroy();
    stopForeground(true);
  }

  @Override
  public IBinder onBind(Intent intent) {
    return null;
  }

  private void createNotificationChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationChannel serviceChannel = new NotificationChannel(
        CHANNEL_ID,
        "Focus Timer",
        NotificationManager.IMPORTANCE_LOW
      );
      NotificationManager manager = getSystemService(NotificationManager.class);
      if (manager != null) {
        manager.createNotificationChannel(serviceChannel);
      }
    }
  }
}
