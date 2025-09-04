package com.dev.tallesguerra.notes

import android.annotation.SuppressLint
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.dev.tallesguerra.notes.ui.theme.NotesTheme
import java.text.SimpleDateFormat
import java.util.Locale


class MainActivity : ComponentActivity() {
  @OptIn(ExperimentalMaterial3Api::class)
  private val viewModel: NoteViewModel by viewModels()

  @OptIn(ExperimentalMaterial3Api::class) // Opt-in for TopAppBar and Scaffold
  @SuppressLint("UnusedMaterial3ScaffoldPaddingParameter") // For Scaffold's innerPadding
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContent {
      NotesTheme {
        Scaffold(
          topBar = {
            TopAppBar(title = { Text("Notas") })
          }
        ) { innerPadding ->
          NoteScreen(
            viewModel = viewModel,
            modifier = Modifier.padding(innerPadding) // Apply Scaffold's padding
          )
        }
      }
    }
  }
}

@Composable
fun NoteScreen(viewModel: NoteViewModel, modifier: Modifier = Modifier) { // Accept modifier
  NoteContent(
    text = viewModel.text,
    notes = viewModel.notes,
    onTextChange = viewModel::onTextChange,
    onSave = viewModel::save,
    onClear = viewModel::clearText,
    onDelete = viewModel::deleteAll,
    modifier = modifier // Pass modifier to NoteContent
  )
}

@Composable
fun NoteContent(
  text: String,
  notes: List<NoteItem>,
  onTextChange: (String) -> Unit,
  onSave: () -> Unit,
  onClear: () -> Unit,
  onDelete: () -> Unit,
  modifier: Modifier = Modifier
) {
  Column(
    modifier = modifier // Apply the modifier from NoteScreen (which includes Scaffold padding)
      .fillMaxWidth()
      .padding(16.dp), // Additional padding for the content itself
    verticalArrangement = Arrangement.spacedBy(16.dp)
  ) {
    OutlinedTextField(
      value = text,
      onValueChange = onTextChange,
      label = { Text("Escreva sua nota") },
      placeholder = { Text("Ex.: Comprar café") },
      modifier = Modifier
        .fillMaxWidth()
        .heightIn(min = 120.dp),
      singleLine = false,
      maxLines = 8,
      keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done)
    )

    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.spacedBy(12.dp),
      verticalAlignment = Alignment.CenterVertically
    ) {
      Button(onClick = onSave, modifier = Modifier.weight(1f)) { Text("Salvar") }
      OutlinedButton(
        onClick = onClear, modifier = Modifier
          .weight(1f)

      ) {
        Text("Limpar")
      }
      Button(
        onClick = onDelete, modifier = Modifier
          .weight(1.2f)
      ) {

        Text("Excluir Tudo")


      }
    }

    Text("Notas Salvas: ", style = MaterialTheme.typography.titleMedium)

    if (notes.isEmpty()) {
      Text("Nenhuma nota salva ainda.")
    } else {
      LazyColumn(
        modifier = Modifier.fillMaxSize(), // This will now respect the padding from Scaffold and Column
        verticalArrangement = Arrangement.spacedBy(8.dp)
      ) {
        items(
          notes,
          key = { it.id }
        ) { note ->
          NoteCard(note)
        }
      }
    }
  }
}

@Composable
private fun NoteCard(note: NoteItem) {
  Surface(
    tonalElevation = 2.dp,
    shape = MaterialTheme.shapes.medium,
    modifier = Modifier.fillMaxWidth(),

  ) {
    Column(Modifier.padding(12.dp)) {
      Text(note.content, style = MaterialTheme.typography.bodyLarge)
      Spacer(Modifier.height(8.dp))
      Text(
        text = formatDate(note.createdAt),
        style = MaterialTheme.typography.bodySmall,
      )
    }
  }
}

private fun formatDate(dateMillis: Long): String {
  val dateFormat = SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault())
  return dateFormat.format(dateMillis)
}

@Preview(name = "Light", showBackground = true)
@Composable
fun NoteContentPreviewLight() {
  NotesTheme {
    val (text, setText) = remember { mutableStateOf("Comprar Café") }
    val sampleNotes = remember {
      listOf(
        NoteItem(
          id = 1,
          content = "Comprar café",
          createdAt = System.currentTimeMillis() - 1000L * 60 * 60
        ),
        NoteItem(
          id = 2,
          content = "Pagar boleto",
          createdAt = System.currentTimeMillis() - 1000L * 60 * 5
        )
      )
    }

    Surface {
      NoteContent(
        text = text,
        notes = sampleNotes,
        onTextChange = setText,
        onSave = { /* no-op no preview */ },
        onClear = { setText("") },
        onDelete = {/* no-op no preview */ }
        // modifier = Modifier.padding(16.dp) // Example for preview if needed without Scaffold


      )
    }
  }
}
