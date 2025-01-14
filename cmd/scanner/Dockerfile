# Build scanner
FROM golang:1.23.4-alpine3.21 AS scanner-builder
WORKDIR /go/src/github.com/artifacthub/scanner
COPY go.* ./
COPY cmd/scanner cmd/scanner
COPY internal internal
WORKDIR /go/src/github.com/artifacthub/scanner/cmd/scanner
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /scanner .

# Trivy installer
FROM alpine:3.21.2 AS trivy-installer
RUN apk --no-cache add curl
RUN curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin v0.56.1

# Final stage
FROM alpine:3.21.2
RUN apk --no-cache add ca-certificates && addgroup -S scanner -g 1000 && adduser -S scanner -u 1000 -G scanner
USER 1000
WORKDIR /home/scanner
COPY --from=scanner-builder /scanner ./
COPY --from=trivy-installer /usr/local/bin/trivy /usr/local/bin
CMD ["./scanner"]
