//
//  Sirat_Al_huda_widgetLiveActivity.swift
//  Sirat Al huda widget
//
//  Created by Hassan Tageddine on 4/26/26.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct Sirat_Al_huda_widgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct Sirat_Al_huda_widgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: Sirat_Al_huda_widgetAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension Sirat_Al_huda_widgetAttributes {
    fileprivate static var preview: Sirat_Al_huda_widgetAttributes {
        Sirat_Al_huda_widgetAttributes(name: "World")
    }
}

extension Sirat_Al_huda_widgetAttributes.ContentState {
    fileprivate static var smiley: Sirat_Al_huda_widgetAttributes.ContentState {
        Sirat_Al_huda_widgetAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: Sirat_Al_huda_widgetAttributes.ContentState {
         Sirat_Al_huda_widgetAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: Sirat_Al_huda_widgetAttributes.preview) {
   Sirat_Al_huda_widgetLiveActivity()
} contentStates: {
    Sirat_Al_huda_widgetAttributes.ContentState.smiley
    Sirat_Al_huda_widgetAttributes.ContentState.starEyes
}
