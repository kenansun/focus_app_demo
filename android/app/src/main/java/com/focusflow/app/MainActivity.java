package com.focusflow.app;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import com.focusflow.app.plugins.FocusTimerPlugin;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    registerPlugin(FocusTimerPlugin.class);
  }
}
