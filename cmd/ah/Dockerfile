# Build ah
FROM golang:1.23.5-alpine3.21 AS ah-builder
ARG VERSION
ARG GIT_COMMIT
WORKDIR /go/src/github.com/artifacthub/ah
COPY go.* ./
COPY cmd/ah cmd/ah
COPY internal internal
WORKDIR /go/src/github.com/artifacthub/ah/cmd/ah
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-X main.version=$VERSION -X main.gitCommit=$GIT_COMMIT" -o /ah .

# Final stage
FROM alpine:3.21.1
RUN apk --no-cache add git && addgroup -S ah -g 1000 && adduser -S ah -u 1000 -G ah
USER 1000
COPY --from=ah-builder /ah /usr/local/bin
