{{- define "nebari-chat.name" -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- $name | trunc 63 | trimSuffix "-" }}
{{- end -}}

{{- define "nebari-chat.fullname" -}}
{{- $fullname := "" -}}
{{- if .Values.fullnameOverride -}}
{{- $fullname = .Values.fullnameOverride -}}
{{- else -}}
{{- $name := include "nebari-chat.name" . -}}
{{- if contains $name .Release.Name -}}
{{- $fullname = .Release.Name -}}
{{- else -}}
{{- $fullname = printf "%s-%s" .Release.Name $name -}}
{{- end -}}
{{- end -}}
{{- $fullname | trunc 63 | trimSuffix "-" }}
{{- end -}}

{{- define "nebari-chat.labels" -}}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "-" | quote }}
app.kubernetes.io/name: {{ include "nebari-chat.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "nebari-chat.selectorLabels" -}}
app.kubernetes.io/name: {{ include "nebari-chat.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
