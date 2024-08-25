import { Document, Page, Text, View } from "@react-pdf/renderer";
import { Message } from "ai";

type ChatPDFProps = {
  documentId: string;
  messages: Message[];
};

export function ChatPDF({ documentId, messages }: ChatPDFProps) {
  return (
    <Document>
      <Page
        style={{
          paddingTop: 35,
          paddingBottom: 65,
          paddingHorizontal: 35,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            marginBottom: 20,
            textAlign: "center",
            color: "grey",
          }}
          fixed
        >
          ~ Makify - Chat with PDF ~
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
          }}
        >
          Chat conversation
        </Text>
        <Text
          style={{
            fontSize: 12,
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          Document id: {documentId}
        </Text>
        {messages
          .filter(
            (message) => !(message.data as Record<string, any>)?.messageType,
          )
          .map((message, index) => {
            return (
              <View key={index}>
                <Text
                  key={`message-${message.id}${message.role}`}
                  style={{
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    fontSize: 12,
                    margin: 6,
                  }}
                >
                  {message.role}
                </Text>
                <Text
                  key={`message-${message.id}`}
                  style={{
                    fontSize: 12,
                    margin: 6,
                    color: "gray",
                  }}
                >
                  {message.content}
                </Text>
              </View>
            );
          })}
        <Text
          style={{
            position: "absolute",
            fontSize: 12,
            bottom: 30,
            left: 0,
            right: 0,
            textAlign: "center",
            color: "grey",
          }}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
