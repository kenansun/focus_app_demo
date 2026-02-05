package com.focusflow.app.plugins;

import com.getcapacitor.Plugin;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import android.app.Activity;
import android.content.Intent;
import android.os.Build;
import com.focusflow.app.services.FocusTimerService;
import android.os.Handler;
import android.os.Looper;
import com.getcapacitor.JSObject;
import android.provider.Settings;

@CapacitorPlugin(name = "FocusTimer")
public class FocusTimerPlugin extends Plugin {
  private Handler handler = new Handler(Looper.getMainLooper());
  private boolean ticking = false;
  private long lastTick = 0;
  private String currentMode = "focus";

  @PluginMethod
  public void startTimer(PluginCall call) {
    String mode = call.getString("mode", "focus");
    currentMode = mode;
    Intent serviceIntent = new Intent(getContext(), FocusTimerService.class);
    serviceIntent.putExtra("mode", mode);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      getContext().startForegroundService(serviceIntent);
    } else {
      getContext().startService(serviceIntent);
    }
    if (!ticking) {
      ticking = true;
      lastTick = System.currentTimeMillis();
      handler.post(tickRunnable);
    }
    call.resolve();
  }
  @PluginMethod
  public void stopTimer(PluginCall call) {
    Intent serviceIntent = new Intent(getContext(), FocusTimerService.class);
    getContext().stopService(serviceIntent);
    if (ticking) {
      ticking = false;
      handler.removeCallbacks(tickRunnable);
      JSObject payload = new JSObject();
      payload.put("mode", currentMode);
      notifyListeners("finish", payload);
    }
    call.resolve();
  }
  @PluginMethod
  public void minimizeApp(PluginCall call) {
    Activity activity = getActivity();
    if (activity != null) {
      activity.moveTaskToBack(true);
    }
    call.resolve();
  }

  @PluginMethod
  public void requestOverlayPermission(PluginCall call) {
    Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    getContext().startActivity(intent);
    call.resolve();
  }

  @PluginMethod
  public void requestUsageAccess(PluginCall call) {
    Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    getContext().startActivity(intent);
    call.resolve();
  }

  @PluginMethod
  public void requestAccessibilityService(PluginCall call) {
    Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    getContext().startActivity(intent);
    call.resolve();
  }

  private final Runnable tickRunnable = new Runnable() {
    @Override
    public void run() {
      if (!ticking) return;
      long now = System.currentTimeMillis();
      long deltaMs = now - lastTick;
      lastTick = now;
      JSObject payload = new JSObject();
      payload.put("mode", currentMode);
      payload.put("deltaMs", deltaMs);
      notifyListeners("tick", payload);
      handler.postDelayed(this, 1000);
    }
  };
}
