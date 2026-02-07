import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionIcon from "@mui/icons-material/Description";
import DrawIcon from "@mui/icons-material/Draw";

// Types

type StatusType = "Draft" | "In Review" | "Signed";

interface DocItem {
  id: number;
  name: string;
  url: string;
  status: StatusType;
}

export default function DocumentChamber() {
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);

  // Signature Pad
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);

  // Upload Handler
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc: DocItem = {
      id: Date.now(),
      name: file.name,
      url: URL.createObjectURL(file),
      status: "Draft",
    };

    setDocuments((prev) => [...prev, newDoc]);
  };

  // Signature Logic
  const startDraw = () => setDrawing(true);
  const endDraw = () => setDrawing(false);

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const updateStatus = (newStatus: StatusType) => {
    if (!selectedDoc) return;
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === selectedDoc.id ? { ...doc, status: newStatus } : doc
      )
    );
    setSelectedDoc((prev) => (prev ? { ...prev, status: newStatus } : prev));
  };

  const statusColor = (status: StatusType) => {
    if (status === "Draft") return "warning";
    if (status === "In Review") return "info";
    return "success";
  };

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* LEFT PANEL */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardHeader title="Document Chamber" />
            <CardContent>
              <Stack spacing={2}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadFileIcon />}
                >
                  Upload PDF / Docs
                  <input
                    hidden
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleUpload}
                  />
                </Button>

                <Stack spacing={1}>
                  {documents.map((doc) => (
                    <Card
                      key={doc.id}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                      onClick={() => setSelectedDoc(doc)}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <DescriptionIcon fontSize="small" />
                        <Typography variant="body2">{doc.name}</Typography>
                      </Stack>

                      <Chip
                        label={doc.status}
                        color={statusColor(doc.status) as any}
                        size="small"
                      />
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT SIDE */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardHeader title="Preview & Sign" />
            <CardContent>
              {!selectedDoc && (
                <Typography variant="body2" color="text.secondary">
                  Select a document to preview
                </Typography>
              )}

              {selectedDoc && (
                <Stack spacing={3}>
                  {/* Preview */}
                  <Box
                    sx={{
                      width: "100%",
                      height: 400,
                      border: "1px solid #ddd",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <iframe
                      src={selectedDoc.url}
                      width="100%"
                      height="100%"
                    />
                  </Box>

                  {/* Status Buttons */}
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Button
                      variant="outlined"
                      onClick={() => updateStatus("Draft")}
                    >
                      Draft
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => updateStatus("In Review")}
                    >
                      In Review
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => updateStatus("Signed")}
                    >
                      Signed
                    </Button>
                  </Stack>

                  {/* Signature Pad */}
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                      <DrawIcon fontSize="small" />
                      <Typography fontWeight={600}>E-Signature (Mock)</Typography>
                    </Stack>

                    <canvas
                      ref={canvasRef}
                      width={500}
                      height={160}
                      onMouseDown={startDraw}
                      onMouseUp={endDraw}
                      onMouseLeave={endDraw}
                      onMouseMove={draw}
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: 8,
                        width: "100%",
                        background: "white",
                      }}
                    />

                    <Box mt={2}>
                      <Button variant="outlined" onClick={clearSignature}>
                        Clear Signature
                      </Button>
                    </Box>
                  </Box>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}